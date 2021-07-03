from pony import orm
from pony.orm import PrimaryKey, db_session

from cloudfirewall.db import database
from cloudfirewall.server.plugins.nftables.dto import CreateFirewallRequest, FirewallRuleRequest


class SecurityGroup(database.Entity):
    _table_ = 'plugin_nft_group'

    id = PrimaryKey(int, auto=True)
    name = orm.Required(str)
    description = orm.Optional(str)

    # Default policy
    inbound_policy = orm.Required(int)
    outbound_policy = orm.Required(int)

    # Firewall rules
    rules = orm.Set("SecurityGroupRule", reverse="security_group")

    @classmethod
    def create(cls, create_request: CreateFirewallRequest):
        SecurityGroup(
            name=create_request.name,
            description=create_request.description,
            inbound_policy=create_request.inbound_policy,
            outbound_policy=create_request.outbound_policy
        )

    @db_session
    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "inbound_policy": self.inbound_policy,
            "outbound_policy": self.outbound_policy,
            "rules": [rule.json() for rule in self.rules]
        }


class SecurityGroupRule(database.Entity):
    _table_ = 'plugin_nft_group_rules'

    id = PrimaryKey(int, auto=True)
    security_group = orm.Required("SecurityGroup", reverse="rules")

    chain = orm.Required(int)
    protocol = orm.Required(int)
    ip = orm.Required(str)
    port = orm.Required(int)
    policy = orm.Required(int)

    @classmethod
    def create(cls, group: SecurityGroup, rule: FirewallRuleRequest):
        SecurityGroupRule(
            security_group=SecurityGroup[group.id],
            chain=rule.chain,
            protocol=rule.protocol,
            ip=rule.ip,
            port=rule.port,
            policy=rule.policy
        )

    def update_rule(self, rule_request: FirewallRuleRequest):
        self.chain = rule_request.chain
        self.protocol = rule_request.protocol
        self.ip = rule_request.ip
        self.port = rule_request.port
        self.policy = rule_request.policy

    def json(self):
        return {
            "id": self.id,
            "chain": self.chain,
            "protocol": self.protocol,
            "ip": self.ip,
            "port": self.port,
            "policy": self.policy
        }
