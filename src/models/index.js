
import { User } from "./user.model.js";
import { Profile } from "./profile.model.js";
import { Article } from "./article.model.js";
import { Tag } from "./tag.model.js";
import { ArticleTag } from "./articleTag.model.js";

User.hasOne(Profile, { //un user tiene un solo profile
    foreignKey: "userId", // se le dice a sequelize que la columna que conecta las dos tablas es userID, que es la que está en profile.
    as: "profile", //es un alias, cuando traigamos un usuario con un perfil, se va a llamar profile.
});

Profile.belongsTo(User, { //un perfil pertenece a un user
    foreignKey: "userId", //indica la columna puente
    as: "user", //cuando traigamos un perfil, se va a llamar user
}); //un usuario tiene un pperil y un perfil pertenece a un usuario


User.hasMany(Article, { //un usuario tiene muchos artículos
    foreignKey: "userId", //está conectado por userId que se encuenta en la tabla articles
    as: "articles", //cuando traigamos un usuario, sus articulos se van a llamar articles
});

Article.belongsTo(User, { //un articulo pertenece a un user 
    foreignKey: "userId", //misma columna de conexión
    as: "author", //cuando traigas un articulo, el usuario se va a llamar author, en lugar de user 
});


Article.belongsToMany(Tag, { //un articulos puede pertenecer a muchos tags
    through: ArticleTag, //indica que la relación pasa por la tabla intermedia ArticleTag.
    foreignKey: "articleId", // en la tabla ìntermedia, la columna que apunta al articulo articleId
    
    as: "tags", // al traer un articulo, sus etiquetas se van a llamar tags que es un alias
});

Tag.belongsToMany(Article, { // tag pertenece a muchos artículos
    through: ArticleTag, //La tabla intermedia que los relaciona es ArticleTag
    foreignKey: "tagId", // columna puente
    as: "articles", // el alias con el que vamos a traer los datos al realizar consultas
});

export { User, Profile, Article, Tag, ArticleTag };