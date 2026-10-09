<!--FORMATO IMAGEN-->
<template>
    <div class="mt-15 ml-15 mr-15">
        <div class="big-font font-weight-medium mb-2">
            {{ pregunta.pregunta }}
        </div>
        <v-slide-group v-model="model" selected-class="br-success" show-arrows>
            <v-row justify="center">
                <v-col class="centered" v-for="(respuesta, index) in pregunta.respuestas" cols="3">
                    <v-slide-group-item :key="index" v-slot="{ isSelected, toggle, selectedClass }">
                        <v-card :disabled="isDisabled" color="white lighten-1" :class="['ma-4', selectedClass]" height="100"
                            width="100" :style="{ border: isSelected ? '5px solid #F87060' : 'none' }">
                            <div class="card-image" :style="{ backgroundImage: 'url(' + getImage(respuesta.imagen) + ')' }"
                                @click="toggle"></div>
                        </v-card>
                    </v-slide-group-item>
                </v-col>
            </v-row>
        </v-slide-group>

    </div>
</template>

<script>
import { useAppStore } from '@/store/app'
import { watch, ref } from 'vue'
import { SERVER_URL } from '@/communicationsManager';
export default {
    name: 'Formato4',
    props: {
        preguntaSeleccionada: {
            type: Object,
            required: true
        },
        isDisabled: {
            type: Boolean,
            required: true
        }
    },
    data() {
        const store = useAppStore();
        const model = ref(null);
        watch(model, (val) => {
            if (val !== undefined) {
                store.setRespuesta(this.preguntaSeleccionada.respuestas[val].respuesta);
            } else {
                store.setRespuesta('');
            }
        });
        return {
            store,
            pregunta: {
            },
            selectedAnswer: null,
            estilo: {
                "border": '2px solid red',
            },
            model,
        };
    },
    methods: {
        getImage(fileName) {
            if (!fileName) return '';
            if (/^(https?:|data:|\/)/.test(fileName)) return fileName;
            return `${SERVER_URL}/imagenPregunta/${fileName}`;
        },

        toggle() {
            this.estilo.border = '2px solid red'
        }
    },
    created() {
        this.pregunta = this.preguntaSeleccionada;
    },
};
</script>
<style>
.card-image {
    width: 100%;
    height: 100%;
    background-size: contain;
    /* or 'contain' based on preference */
    background-repeat: no-repeat;
    background-position: center center;
}
</style>
