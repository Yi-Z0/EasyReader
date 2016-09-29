declare class Realm{
  write(transactions:()=>void):void,
  objects(schema:string):any,
  create(schema:string,attributes:any):any,
  
  addListener(event:string,callback:()=>void):void,
  removeAllListeners():void,
};

declare function realmFactory(): Realm;

