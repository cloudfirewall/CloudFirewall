from fastapi import APIRouter, Depends, Header, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Optional, List
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt

key="CFsecret"
context = CryptContext(schemes=['bcrypt'], deprecated="auto") 
security= HTTPBearer()

def encode_token(username):
    payload= {'exp':datetime.utcnow()+timedelta(days=1, minutes=20),
              'iat': datetime.utcnow(),
              'sub': username}
    return jwt.encode(payload, key, algorithms='HS256')

def decode_token(token):
    try:
        payload = jwt.decode(token, key,algorithms='HS256')
        return payload['sub']
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Signature has expired' )
    except jwt.InvalidTokenError as e:
        print(e)
        raise HTTPException(status_code=401, detail='Invalid token')  
        
def auth_wrapper(auth:HTTPAuthorizationCredentials = Security(security)):
    return decode_token(auth.credentials)

def hashPassword(password:str):
    return context.hash(password) 

def verifyPassword(plainPassword, hashedPassword):
    return context.verify(plainPassword, hashedPassword)  