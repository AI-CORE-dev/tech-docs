## Antes de desarrollar, tener en cuenta:
-

-

-

-

## Lineamientos generales:

-

-

-

-


## A rajatabla:

-

-

-

-


## Desarrollando:

-

-

-

-

## En un mundo ideal:

-

-

-

-

<br />
<br />
<br />

## Ejemplos

### Usar camelCase en nombre de atributos.
##### BAD:
```javascript
    @Column({ name: 'last_login', nullable: true })
    last_login: Date;
```

##### GOOD:
```javascript
    @Column({ name: 'last_login', nullable: true })
    lastLogin: Date;
```

### Usar plurales para los arrays.
##### BAD:
```javascript
    @OneToMany(type => Token, token => token.user, { cascade: true })
    token: Token[];
```

##### GOOD:
```javascript
    @OneToMany(type => Token, token => token.user, { cascade: true })
    tokens: Token[];
```

### Usar prefijo is para los boolean
##### BAD:
```javascript
    @Column({ default: false, name: 'is_admin' })
    admin: boolean;
```

##### GOOD:
```javascript
    @Column({ default: false, name: 'is_admin' })
    isAdmin: boolean;
```

### Ordenar configuraciones de las anotaciones por prioridad/importancia.
### Prioridad: name, type, unique, nullable, default
##### BAD:
```javascript
    @Column({ default: false, name: 'is_admin' })
    isAdmin: boolean;
```

##### GOOD:
```javascript
    @Column({ name: 'is_admin', is_default: true })
    isAdmin: boolean;
```

### Reducir maximo posible el uso del cascade:true. Tiene que haber una muy buena razon para usarlo.
### Ejemplo de uso de cascade, a priori, injustificado, entre las entidades User y Token.
```javascript
    @OneToMany(type => Token, token => token.user, { cascade: true })
    tokens: Token[];
```

### Nombres de tablas en singular y usando snake case.
##### BAD:
```javascript
    @Entity('postTags')
    export class PostTag {
    
    @Entity('post_tags')
    export class PostTag {   
```

##### GOOD:
```javascript
    @Entity('post_tag')
    export class PostTag {
```

### Declaracion de Logger en todas las clases.
```javascript
    @Injectable()
    export class ProfileService {

  private readonly logger = new Logger(ProfileService.name); 
```

### Logueo con logger y NO con console.log()
##### BAD:
```javascript
    console.log(`Unauthorized access -> ClaimProfileId: ${claimProfileId}, BodyPostId: ${bodyPostId}`);
```

##### GOOD:
```javascript
    this.logger.warn(`Unauthorized access -> ClaimProfileId: ${claimProfileId}, BodyPostId: ${bodyPostId}`);
```

### Instanciacion y Estructura correcta de Exceptions.
```javascript
    throw new BadRequestException('P01', 'Este perfil ya es una institución');

    {
        'statusCode' : 400,
        'error' : 'P01',
        'message', : 'Este perfil ya es una institución'
    }
```
