Vue.component('componente-autors', {
    data() {
        return {
            valor:'',
            autors:[],
            accion:'nuevo',
            autor:{
                idAutor: new Date().getTime(),
                codigo:'',
                nombre:'',
                pais:'',
                telefono:'',
            }
        }
    },
    methods:{
        buscarAutor(e){
            this.listar();
        },
        eliminarAutor(idAutor){
            if( confirm(`Esta seguro de eliminar el autor?`) ){
                let store = abrirStore('autors', 'readwrite'),
                query = store.delete(idAutor);
            query.onsuccess = e=>{
                this.nuevoAutor();
                this.listar();
            };
            }
        },
        modificarAutor(autor){
            this.accion = 'modificar';
            this.autor = autor;
        },
        guardarAutor() {
           // validacion de espacios en blanco
            Object.keys(this.autor).forEach(key => {
                if (typeof this.autor[key] === 'string') {
                    this.autor[key] = this.autor[key].trim();
                }
            });
            if (Object.values(this.autor).some(value => value === '')) {
                alert('Por favor, complete todos los campos antes de guardar el registro.');
                return;
            }

            let store = abrirStore('autors', 'readwrite');

            // Comprueba si el coodigo ya existe
            let codeExists = this.autors.some(autor => autor.codigo === this.autor.codigo);

            if (codeExists) {
                // alerta de codigo existente
                alert('El código ya existe. Por favor, elija otro código.');
                return;
            }

            
            let query = store.put({ ...this.autor });

            query.onsuccess = (e) => {
                this.nuevoAutor();
                this.listar();
            };

            query.onerror = (e) => {
                console.error('Error al guardar en autor', e.message());
            };
        },
        nuevoAutor(){
            this.accion = 'nuevo';
            this.autor = {
                idAutor: new Date().getTime(),
                codigo:'',
                nombre:'',
                pais:'',
                telefono: ''
            }
        },
        listar(){
            let store = abrirStore('autors', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.autors = data.result
                    .filter(autor=>autor.codigo.includes(this.valor) || 
                    autor.nombre.toLowerCase().includes(this.valor.toLowerCase()) || 
                    autor.pais.toLowerCase().includes(this.valor.toLowerCase()) ||
                    autor.telefono.toLowerCase().includes(this.valor.toLowerCase()));
            };

        
        },

    },
    template: `
    <div class="my-4">
        <div class="row">
            <div class="col col-md-6">
                <div class="card text-bg">
                    <div class="card-header">REGISTRO DE AUTORES</div>
                    <div class="catd-body">
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo</div>
                            <div class="col col-md-3">
                                <input v-model="autor.codigo" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre</div>
                            <div class="col col-md-5">
                                <input v-model="autor.nombre" type="text" class="form-control">
                            </div>
                        </div>
                
                        <div class="row p-1">
                            <div class="col col-md-2">Pais</div>
                            <div class="col col-md-3">
                                <input v-model="autor.pais" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Telefono</div>
                            <div class="col col-md-3">
                                <input v-model="autor.telefono"  type="number" min="0" class="form-control">
                            </div>
                        </div>


                        <div class="row p-1">
                        <div class="col text-center">
                            <div class="d-flex justify-content-center ">
                                <button @click.prevent.default="guardarAutor" class="btn btn-outline-success ">GUARDAR</button>
                                <div style="margin-right: 20px;"></div>
                                <button @click.prevent.default="nuevoAutor" class="btn btn-outline-warning">NUEVO</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="my-4">
            <div class="col col-md-8">
                <div class="card text-bg">
                    <div class="card-header">LISTADO DE AUTORES</div>
                    <div class="card-body">
                        <form id="frmAutor">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>BUSCAR</th>
                                        <th colspan="5">
                                            <input placeholder="Codigo, Nombre, Pais" type="search" v-model="valor" @keyup="buscarAutor" class="form-control">
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>NOMBRE</th>
                                        <th>PAIS</th>
                                        <th>TELEFONO</th>
                                        
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click="modificarAutor(autor)" v-for="autor in autors" :key="autor.idAutor">
                                        <td>{{autor.codigo}}</td>
                                        <td>{{autor.nombre}}</td>
                                        <td>{{autor.pais}}</td>
                                        <td>{{autor.telefono}}</td>
                                        
                                        <td><button @click.prevent.default="eliminarAutor(autor.idAutor)" class="btn btn-outline-danger">ELIMINAR</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
});