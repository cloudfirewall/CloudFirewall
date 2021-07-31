# Create schemas

from pydantic import BaseModel

class CommandCreate(BaseModel):

    id: int
    Firewall_table:str
    chain:str
    protocol:str
    ip_address:str
    port:int
    rule:str

# Provide configurations to pydantic
# Pydantic's orm_mode will tell the Pydantic model to read the data even if it is not a dict.
    class Config:
        orm_mode = True