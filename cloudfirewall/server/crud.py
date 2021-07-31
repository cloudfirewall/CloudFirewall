
from sqlalchemy.orm import Session
import models, schemas

def delete_table_by_id(db:Session,id:int):
    try:
        db.query(models.NFT).filter(models.NFT.id == id).delete()
        db.commit()
    except Exception as e:
        raise Exception(e)

def get_table_by_id(db:Session, id:int):

    return db.query(models.NFT).filter(models.NFT.id == id).first()

def get_table(db:Session, id:int):

    return {db.query(models.NFT).filter(models.NFT.id == id).first()}


def get_command(db:Session):
    """
    To get all the commands that is defined.
    """
    return db.query(models.NFT).all()

def create_table(db:Session, user:schemas.CommandCreate):
    """
    Define the entities tha will be in the database

    """
    db_user = models.NFT(id = user.id,
                         Firewall_table = user.Firewall_table,
                         chain = user.chain,
                         protocol = user.protocol,
                         ip_address = user.ip_address,
                         port = user.port,
                         rule = user.rule
                         )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


