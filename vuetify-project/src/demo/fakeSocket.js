import { battleQuestions, botUser } from './data';
import { battle, loadUser, pushHistory } from './store';
import { isCorrect } from './api';

const TEAM_HP = 3;

function teamsOf(room) {
  return {
    team1: room.users.filter((user) => user.team === 1),
    team2: room.users.filter((user) => user.team === 2),
  };
}

function stopBot() {
  if (battle.botTimer) {
    clearInterval(battle.botTimer);
    battle.botTimer = null;
  }
}

function otherTeam(team) {
  return team === 1 ? 2 : 1;
}

function placeBotOpposite(room, playerTeam) {
  const bot = room.users.find((user) => user.id === 'bot');
  if (bot) bot.team = otherTeam(playerTeam);
}

function finishIfNeeded(room, fire) {
  const team1 = room.teams?.team1?.[0];
  const team2 = room.teams?.team2?.[0];
  if (!team1 || !team2) return;
  if (team1.hp > 0 && team2.hp > 0) return;
  if (room.finished) return;
  room.finished = true;
  room.winner = team1.hp <= 0 ? 2 : 1;
  stopBot();
  const user = loadUser();
  const won = room.users.find((item) => item.email === user?.email)?.team === room.winner;
  pushHistory({
    historial: `Has ${won ? 'guanyat' : 'perdut'} la batalla ${room.name}`,
    hora: new Date().toISOString().slice(0, 19).replace('T', ' ').replaceAll('-', '/'),
  });
  fire('gameFinished', room);
}

function dealDamage(room, attackerTeam) {
  const target = attackerTeam === 1 ? room.teams.team2[0] : room.teams.team1[0];
  target.hp = Math.max(0, target.hp - 1);
}

export function createDemoSocket(state) {
  const listeners = {};

  function fire(event, data) {
    (listeners[event] || []).forEach((callback) => callback(data));
  }

  function startBot(room) {
    stopBot();
    battle.botTimer = setInterval(() => {
      if (!room.started || room.finished) {
        stopBot();
        return;
      }
      const bot = room.users.find((user) => user.id === 'bot');
      if (!bot?.team) return;
      if (Math.random() < 0.55) dealDamage(room, bot.team);
      fire('updateTeams', room);
      finishIfNeeded(room, fire);
    }, 3500);
  }

  const socket = {
    connect() {
      state.connected = true;
    },
    disconnect() {
      state.connected = false;
      stopBot();
      if (battle.room && !battle.room.started) battle.room = null;
    },
    on(event, callback) {
      (listeners[event] ||= []).push(callback);
      return socket;
    },
    off(event, callback) {
      listeners[event] = (listeners[event] || []).filter((item) => item !== callback);
      return socket;
    },
    emit(event, payload) {
      const user = loadUser();
      const sessionId = 'demo-session';

      if (event === 'createRoom') {
        if (battle.room && battle.room.owner === user?.email && !battle.room.started) {
          fire('roomNotCreated', payload);
          return;
        }
        const room = {
          ...payload,
          id: 'GameRoom-demo',
          players: 2,
          started: false,
          finished: false,
          owner: user?.email || 'alumne@test.cat',
          ownerId: sessionId,
          users: [
            {
              id: sessionId,
              email: user?.email || 'alumne@test.cat',
              image: user?.image,
              level: user?.lvl || 1,
              preguntas: [],
            },
            { ...botUser, preguntas: [] },
          ],
        };
        battle.room = room;
        fire('roomCreated', room);
        return;
      }

      if (event === 'joinRoom') {
        const room = battle.room;
        if (!room || room.id !== payload?.id || room.started) {
          fire('roomNotJoined', payload);
          return;
        }
        if (room.private && payload.password !== room.password) {
          fire('wrongPassword', payload);
          return;
        }
        if (room.users.some((item) => item.id === sessionId)) {
          fire('alreadyJoined', room);
          return;
        }
        room.users.push({
          id: sessionId,
          email: user?.email,
          image: user?.image,
          level: user?.lvl || 1,
          preguntas: [],
        });
        room.players = room.users.length;
        fire('roomJoined', room);
        return;
      }

      if (event === 'joinTeam') {
        const room = battle.room;
        if (!room) return;
        const player = room.users.find((item) => item.id === sessionId);
        if (!player) return;
        let team = payload.team;
        if (team === 0) {
          const team1 = room.users.filter((item) => item.team === 1 && item.id !== 'bot').length;
          const team2 = room.users.filter((item) => item.team === 2 && item.id !== 'bot').length;
          team = team1 <= team2 ? 1 : 2;
        }
        player.team = team;
        placeBotOpposite(room, team);
        fire('teamUsers', teamsOf(room));
        return;
      }

      if (event === 'changeTeam') {
        const room = battle.room;
        if (!room) return;
        const player = room.users.find((item) => item.id === sessionId);
        if (!player?.team) return;
        player.team = otherTeam(player.team);
        placeBotOpposite(room, player.team);
        fire('teamUsers', teamsOf(room));
        return;
      }

      if (event === 'getTeamUsers') {
        if (!battle.room) return;
        fire('teamUsers', teamsOf(battle.room));
        return;
      }

      if (event === 'startGame') {
        const room = battle.room;
        if (!room || room.ownerId !== sessionId) return;
        const grouped = teamsOf(room);
        if (!grouped.team1.length || !grouped.team2.length) return;
        room.started = true;
        room.teams = {
          team1: [{ hp: TEAM_HP, maxHp: TEAM_HP }],
          team2: [{ hp: TEAM_HP, maxHp: TEAM_HP }],
        };
        fire('startingGame', room);
        setTimeout(() => {
          fire('gameStarted', room);
          startBot(room);
        }, 5000);
        return;
      }

      if (event === 'checkAnswer') {
        const room = battle.room;
        if (!room?.teams || room.finished) return;
        const question = battleQuestions.find((item) => item.id === payload?.question?.id) || payload?.question;
        const correcto = isCorrect(question, payload?.answer);
        fire('answerChecked', { correct: correcto });
        if (correcto) {
          const player = room.users.find((item) => item.id === sessionId);
          if (player?.team) dealDamage(room, player.team);
          fire('updateTeams', room);
          finishIfNeeded(room, fire);
        }
      }
    },
  };

  return socket;
}
