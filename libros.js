Vue.component('componente-libros', {
    data() {
        return {
            valor:'',
            libros:[],
            accion:'nuevo',
            libro:{
                idLibro: new Date().getTime(),
                autor:'',
                isbn:'',
                titulo:'',
                editorial:'',
                edicion:'',
            }
        }
    },
    methods:{
        buscarLibro(e){
            this.listar();
        },
        eliminarLibro(idLibro){
            if( confirm(`Esta seguro de elimina el libro?`) ){
                let store = abrirStore('libros', 'readwrite'),
                query = store.delete(idLibro);
            query.onsuccess = e=>{
                this.nuevoLibro();
                this.listar();
            };
            }
        },
        modificarLibro(libro){
            this.accion = 'modificar';
            this.libro = libro;
        },
        guardarLibro() {
            Object.keys(this.libro).forEach(key => {
                if (typeof this.libro[key] === 'string') {
                    this.libro[key] = this.libro[key].trim();
                }
            });

            if (Object.values(this.libro).some(value => value === '')) {
                alert('Por favor, complete todos los campos antes de guardar el libro.');
                return;
            }
        
            // Verificar si el código ya existe en la lista de libros
            let codeExists = this.libros.some(libro => libro.codigo === this.libro.codigo);
            if (codeExists) {
                alert('El código ya existe. Por favor, elija otro código.');
                return;
            }
        
            let store = abrirStore('libros', 'readwrite'),
                query = store.put({ ...this.libro });
        
            query.onsuccess = e => {
                this.nuevoLibro();
                this.listar();
            };
        
            query.onerror = e => {
                console.error('Error al guardar en libros', e.message());
            };
        },
        nuevoLibro(){
            this.accion = 'nuevo';
            this.libro = {
                idLibro: new Date().getTime(),
                autor:'',
                isbn:'',
                titulo:'',
                editorial:'',
                edicion:''
            }
        },
        listar(){
            let store = abrirStore('libros', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.libros = data.result
                    .filter(libro=>libro.autor.includes(this.valor) || 
                    libro.isbn.toLowerCase().includes(this.valor.toLowerCase()) || 
                    libro.titulo.toLowerCase().includes(this.valor.toLowerCase()) ||
                    libro.editorial.toLowerCase().includes(this.valor.toLowerCase()) ||
                    libro.edicion.toLowerCase().includes(this.valor.toLowerCase()) );
            };

        
        },

    },
    template: `
    <div class="my-4">
        <div class="row">
            <div class="col col-md-6">
                <div class="card text-bg">
                    <div class="card-header">REGISTRO DE LIBROS</div>
                    <div class="catd-body">
                        <div class="row p-1">
                            <div class="col col-md-2">Autor</div>
                            <div class="col col-md-3">
                                <input v-model="libro.autor" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">ISBN</div>
                            <div class="col col-md-5">
                                <input v-model="libro.isbn" type="text" class="form-control">
                            </div>
                        </div>
                
                        <div class="row p-1">
                            <div class="col col-md-2">TITULO</div>
                            <div class="col col-md-3">
                                <input v-model="libro.titulo" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">EDITORIAL</div>
                            <div class="col col-md-3">
                                <input v-model="libro.editorial"  type="text" min="0" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">EDICION</div>
                            <div class="col col-md-3">
                                <input v-model="libro.edicion"  type="text" min="0" class="form-control">
                            </div>
                        </div>


                        <div class="row p-1">
                        <div class="col text-center">
                            <div class="d-flex justify-content-center ">
                                <button @click.prevent.default="guardarLibro" class="btn btn-outline-success ">GUARDAR</button>
                                <div style="margin-right: 20px;"></div>
                                <button @click.prevent.default="nuevoLibro" class="btn btn-outline-warning">NUEVO</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="my-4">
            <div class="col col-md-8">
                <div class="card text-bg">
                    <div class="card-header">LISTADO DE LIBROS</div>
                    <div class="card-body">
                        <form id="frmLibro">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>BUSCAR</th>
                                        <th colspan="5">
                                            <input placeholder="Autor, ISBN, Titulo" type="search" v-model="valor" @keyup="buscarLibro" class="form-control">
                                        </th>
                                    </tr>
                                    <tr>
                                        
                                        <th>AUTOR</th>
                                        <th>ISBN</th>
                                        <th>TITULO</th>
                                        <th>EDITORIAL</th>
                                        <th>EDICION</th>
                                        
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click="modificarLibro(libro)" v-for="libro in libros" :key="libro.idLibro">
                                        
                                        <td>{{libro.autor}}</td>
                                        <td>{{libro.isbn}}</td>
                                        <td>{{libro.titulo}}</td>
                                        <td>{{libro.editorial}}</td>
                                        <td>{{libro.edicion}}</td>
                                        
                                        <td><button @click.prevent.default="eliminarLibro(libro.idLibro)" class="btn btn-outline-danger">ELIMINAR</button></td>
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