var app = new Vue({
    el: '#app',
    data:{
        forms:{
            autor:{mostrar:false},
            libros:{mostrar:false},
        }
    },
    methods:{
        abrirFormulario(form){
            this.forms[form].mostrar = !this.forms[form].mostrar;
            this.$refs[form].listar();
        }
    }
});