<template>
    <BackButton :to="'/home/entrenamiento/' + this.$route.params.categoria" />
    <v-app class="no-background">
        <v-container class="fill-height" style="justify-content: center; text-align: center;">
            <v-card style="overflow-y: hidden;" class="myfont platinum-bg round-border">
                <v-card-title class="violet-bg white biggest-font pa-8" style="overflow: auto; text-overflow: clip;">{{
                    this.Ejercicio.nombre }}</v-card-title>
                <v-row style="justify-content: center;">
                    <v-col style="padding-right: 0; padding-bottom: 0;" cols="12" sm="6" md="6" lg="6">
                        <div style="text-align: left;" class="white-bg fill-height">
                            <div class="bigger-font ml-6 pt-2">Informació</div>
                            <v-divider></v-divider>
                            <div style="margin-left: 3em;" class="mt-4 pb-4">
                                <ul>
                                    <li>Tematica: {{ this.tema }} </li>
                                    <li>Tipus: {{ this.tipo }} </li>
                                    <li>{{ this.cantidadEjerciciosH.length }} preguntes</li>
                                    <li>{{ this.cantidadEjercicios.length }} / {{ this.cantidadEjerciciosH.length }}
                                        contestades
                                    </li>
                                    <li>{{ this.expTotal }} punts d'exp.</li>
                                </ul>
                            </div>
                        </div>
                    </v-col>
                    <v-col class="mb-3" cols="8" sm="6" md="6" lg="6">
                        <div class="pt-4 pb-4">
                            <v-progress-circular size="200" width="15" :model-value="(expTotal - expRestante) / expTotal * 100"
                                :color="barColor">
                                <div class="display-1">{{ expTotal - expRestante }}/{{ expTotal }} exp</div>
                            </v-progress-circular>
                        </div>
                        <button class="custom-btn" style="width: 80%;" @click="empezarEjercicio">
                            <span class="shadow"></span>
                            <span class="edge"></span>
                            <span class="front text">
                                Jugar
                            </span>
                        </button>
                    </v-col>
                </v-row>


            </v-card>

        </v-container>
    </v-app>
</template>
<style></style>
    
<script>
import BackButton from '@/components/fab/BackButton.vue';
import { GetResueltas, getEjercicios, getExpEjer } from '@/communicationsManager';
import { useAppStore } from '@/store/app';
//import { socket, state } from './socket';
export default {
    name: 'InfoEjercicio',
    setup() {
        const appStore = useAppStore();
        return {
            appStore
        };
    },
    data() {
        return {
            barColor: '#69306D',
            estado: false,
            ejercicioId: null,
            cantidadEjerciciosH: 0,
            cantidadEjercicios: 0,
            tema: "???",
            tipo: "???",
            expTotal: 0,
            expRestante: 0,
            Ejercicio: {}
        };
    },
    methods: {
        empezarEjercicio() {
            this.$router.push({
                name: 'Ejercicio',
                params: { id: this.Ejercicio.id, categoria: this.$route.params.categoria },
            });
        }
    },
    created() {
        // Para guardar el parámetro 'id' de la ruta en 'ejercicioId'
        getEjercicios(this.$route.params.id).then((res) => {
            this.Ejercicio = res;
            console.log("Ejercicio", this.Ejercicio);
            this.appStore.setEjercicio(this.Ejercicio);
            let userid = this.appStore.getLoginInfo;
            this.cantidadEjerciciosH = res.preguntas;
            this.tipo = res.tipo;
            res.preguntas.forEach(element => {
                //Se calcula la máxima experiencia que se puede conseguir en el ejercicio
                this.expTotal = this.expTotal + element.experiencia;
            });
            let dato = {
                "userId": parseInt(userid.id),
                "ejercicioid": res.id,
            };
            console.log(dato);
            GetResueltas(dato).then((res) => {
                this.cantidadEjercicios = res.filter(element => element.correcta == true);
                if (res.length > 0) {
                    console.log("Preguntas respondidas: ", res);
                    this.estado = true;
                }
            });
            //Calcular experiencia de intentos anteriores (se mostrará la experiencia restante por conseguir)
            getExpEjer(dato).then((res) => {
                this.expRestante = this.expTotal - res.xp;
                console.log("Experiencia: ", this.expRestante, " / ", this.expTotal);
                if (this.expRestante == this.expTotal) {
                    this.barColor = '#69306D';
                }
                if (this.expRestante / this.expTotal < 1) {
                    this.barColor = 'error';
                }
                if (this.expRestante / this.expTotal < 0.5) {
                    this.barColor = 'warning';
                }
                if (this.expRestante == 0) {
                    this.barColor = 'success';
                }
            });
        });
    },
    components: { BackButton }
}

</script>