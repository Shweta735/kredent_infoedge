const { Client } = require("pg");
const db = {};

let client;

const createClient = ()=>{
  client = new Client({
    user: "qlsrssesdjutxw",
    host: "ec2-52-204-232-46.compute-1.amazonaws.com",
    database: "d92tole5gntqj",
    password: '2c94d6e8f133076bb52a705c6b7796d090b755949420fae63cef473d9012f92d',
    port: "5432"
  });
  client.connect();
}

db.init = async () => {
  createClient();
  try {
    //initializing the db
    await client.query(`CREATE TABLE IF NOT EXISTS users(id SERIAL UNIQUE,name varchar(50),phone varchar(15), username varchar(50))`);
    await client.query(`CREATE TABLE IF NOT EXISTS post(id SERIAL UNIQUE, post text,
     posted_by bigint REFERENCES users(id),posted_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP) `);
    await client.query(`CREATE TABLE IF NOT EXISTS comment(id SERIAL UNIQUE,
     comment text, post_id bigint REFERENCES post(id),commented_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
     commented_by bigint REFERENCES users(id) )`);
    await client.query(`CREATE INDEX IF NOT EXISTS post_idx on comment (post_id)`);
} catch (err) {
    console.log(err.stack);
} finally {
    client.end();
}
};

db.checkForExistence = async(value) =>{
  try{
    createClient();
    const res = await client.query(`SELECT id FROM users where username = $1 or phone = $2;`, value);
    return res;
  }catch(err){
    throw new Error(err)
  }
}

db.insertRow = async(tablename, keys, value) =>{
  try{
    createClient();
    let flatValueParamString = '';
    for (let i = 0; i < keys.length; i++) {
      flatValueParamString += `$${i+1},`;
    }
    flatValueParamString = flatValueParamString.slice(0, -1);
    const res = await client.query(`INSERT INTO ${tablename}( ${keys.join()} ) VALUES (${flatValueParamString}) RETURNING id`,value);
    return res;
  }catch(err){
    throw new Error(err)
  }
}  

db.selectOnKeys = async(tablename,keys,value) =>{
  try{
    createClient();
    let q = '';
    for (let i = 0; i < keys.length; i++) {
      const index = i + 1;
      q += `${keys[i]} = $${index} AND `;
    }
    q = q.slice(0, -5);
    const res = await client.query(`SELECT * FROM ${tablename} where ${q};`, value);
    return res;
  }catch(err){
    throw new Error(err)
  }
}  

db.getPost = async() =>{
  try{
    createClient();
    const res = await client.query(`SELECT post.id as id,post,posted_by,name,posted_on from post inner join users on post.posted_by = users.id`, []);
    return res;
  }catch(err){
    throw new Error(err)
  }
} 

db.getCommentsOnPost = async(postIdArray) =>{
   try{
    createClient();
    let flatValueParamString = '';
    for (let i = 0; i < postIdArray.length; i++) {
      flatValueParamString += `$${i+1},`;
    }
    flatValueParamString = flatValueParamString.slice(0, -1);
    const res = await client.query(`SELECT id, post_id from comment where post_id in ( ${flatValueParamString}) `, postIdArray);
    return res;
  }catch(err){
    throw new Error(err)
  }
}   


db.getCommentOnSpecificPost   = async(value) =>{
   try{
    createClient();
    const res = await client.query(`SELECT post_id,comment, name, commented_on from comment 
      inner join users on users.id = comment.commented_by where post_id = $1 `, value);
    return res;
  }catch(err){
    throw new Error(err)
  }
}   
                                                           

module.exports = db;
