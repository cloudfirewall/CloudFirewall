from typing import List

from pydantic import BaseModel, Field


class CreateFirewallRequest(BaseModel):
    name: str = Field(..., example="Firewall Group 1")
    description: str = Field(..., example="This group is applied to xxx servers")
    inbound_policy: int = Field(..., example=0)
    outbound_policy: int = Field(..., example=1)


# class SecurityGroupRule(database.Entity):
#     _table_ = 'plugin_nft_group_rules'
#
#     id = PrimaryKey(int, auto=True)
#     security_group = orm.Required("SecurityGroup", reverse="rules")
#
#     chain = orm.Required(int)
#     protocol = orm.Required(int)
#     ip = orm.Required(str)
#     port = orm.Required(int)
#     policy = orm.Required(int)

class FirewallRuleRequest(BaseModel):
    id: int = Field(..., example=0)
    chain: int = Field(..., example=0)
    protocol: int = Field(..., example=0)
    ip: str = Field(..., example="8.8.8.8/32")
    port: int = Field(..., example=22)
    policy: int = Field(..., example=0)


class RulesetRequest(BaseModel):
    rules: List[FirewallRuleRequest] = Field(...)
