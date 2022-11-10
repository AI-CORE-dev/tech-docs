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
