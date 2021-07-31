from typing import List
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

import crud, schemas, models
from database import SessionLocal, engine

# integrate and use all parts we have created before.
models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency will create new SQLAlchemey SessionLocal
def get_db():

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




@app.post("/nft", response_model=schemas.CommandCreate)
def create_table(user: schemas.CommandCreate, db: Session = Depends(get_db)):

    crud.get_table(db, id = user.id)
    return crud.create_table(db=db, user=user)


@app.get("/nft", response_model=List[schemas.CommandCreate])
def read_table( db: Session = Depends(get_db)):

    users = crud.get_command(db)
    return users

@app.delete("/nft{id}")
def delete_table_by_id(id:int,db:Session = Depends(get_db)):
    """ delete the table by id"""

    users = crud.get_table_by_id(db=db,id=id)
    if not users:
        raise HTTPException(status_code=404,detail=f"No record found to delete")
    try:
        crud.delete_table_by_id(db=db,id=id)
    except Exception as e:
        raise HTTPException(status_code=400,detail=f"Unable to delete")

    return {"delete status":"success"}



@app.get("/nft/firewall")
def read_nft(db:Session = Depends(get_db)):
    """
    get the response body in the form of nftables ruleset

    """

    r = crud.get_command(db=db)

    if r:
        input_rules = ""
        output_rules = ""


        for row in r:
            nft_rule = f"ip saddr {row.ip_address} {row.protocol} dport {row.port} {row.rule};\n"

            if row.chain == "input":
                input_rules += nft_rule
            elif row.chain == "output":
                output_rules += nft_rule

#Below is the format of nftables

        firewall_content = """
#!/usr/bin/nft -f
flush ruleset 
table inet Master {
        chain input{ 
                type filter hook input priority 0; policy accept;
                {input_rules}
        }  
        chain output {
                 type filter hook output priority 0; policy accept;
                 {output_rules}
        }
}        
"""
        firewall_content = firewall_content.replace("{input_rules}", input_rules).replace("{output_rules}", output_rules)
        return firewall_content

