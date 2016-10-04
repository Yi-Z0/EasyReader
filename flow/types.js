declare class Realm {
  write(transactions:()=>void):void,
  objects(schema:string):any,
  create(schema:string,attributes:any):any,
  
  addListener(event:string,callback:()=>void):void,
  removeAllListeners():void,
};

declare type Novel = {
  directoryUrl:string,
  title:string,
  isParseDirectory:bool,
  logo:string,
  directory:string,
  author:string,
  desc:string,
  star:bool,
  created:Date,
  lastReadIndex:number,
}

declare type Article = {
  url:string,
  title:string,
}

declare function realmFactory(): Realm;

