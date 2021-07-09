from datetime import datetime

from pony import orm
from pony.orm import PrimaryKey, db_session

from cloudfirewall.db import database
from cloudfirewall.server.plugins.nftables.const import Policy
from cloudfirewall.server.plugins.nftables.dto import CreateFirewallRequest, FirewallRuleRequest
from cloudfirewall.server.plugins.heartbeat.entities import Node


class SecurityGroup(database.Entity):
    _table_ = 'plugin_nft_group'

    id = PrimaryKey(int, auto=True)
    name = orm.Required(str)
    description = orm.Optional(str)

    # Default policy
    inbound_policy = orm.Required(int)
    outbound_policy = orm.Required(int)

    # If the group is locked, no rules can be added to the group. This is useful when the group
    # is being applied to nodes.
    locked = orm.Required(bool, default=False)

    # Firewall rules
    rules = orm.Set("SecurityGroupRule", reverse="parent_security_group")

    # Nodes where this security group is applied
    nodes = orm.Set("Node", reverse="node_security_group")

    # Updates to the nodes
    node_updates = orm.Set("SecurityGroupUpdate", reverse="ref_security_group")

    @classmethod
    def create(cls, create_request: CreateFirewallRequest):
        SecurityGroup(
            name=create_request.name,
            description=create_request.description,
            inbound_policy=create_request.inbound_policy,
            outbound_policy=create_request.outbound_policy,
            locked=False
        )

    @classmethod
    def get_default(cls):
        uninit_group_ref = SecurityGroup.get(name="UNITIALIZED")
        if not uninit_group_ref:
            uninit_group = SecurityGroup(
                name="UNITIALIZED",
                description="Default uninitialized firewall. This does not apply any rules to the node.",
                inbound_policy=Policy.DROP,
                outbound_policy=Policy.ACCEPT,
                locked=True
            )
            uninit_group.flush()
            return uninit_group
        return SecurityGroup[uninit_group_ref.id]

    @db_session
    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "inbound_policy": self.inbound_policy,
            "outbound_policy": self.outbound_policy,
            "locked": self.locked,
            "rules": [rule.json() for rule in self.rules],
            "nodes": [node.json() for node in self.nodes],
            "nodes_pending": [node_update.ref_node.json() for node_update in self.node_updates]
        }


class SecurityGroupRule(database.Entity):
    _table_ = 'plugin_nft_group_rules'

    id = PrimaryKey(int, auto=True)
    parent_security_group = orm.Required("SecurityGroup", reverse="rules")

    chain = orm.Required(int)
    protocol = orm.Required(int)
    ip = orm.Required(str)
    port = orm.Required(int)
    policy = orm.Required(int)

    @classmethod
    def create(cls, group: SecurityGroup, rule: FirewallRuleRequest):
        SecurityGroupRule(
            parent_security_group=SecurityGroup[group.id],
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


class SecurityGroupUpdate(database.Entity):
    _table_ = 'plugin_nft_group_apply'

    id = PrimaryKey(int, auto=True)
    ref_security_group = orm.Required("SecurityGroup", reverse="node_updates")
    ref_node = orm.Required("Node", reverse="firewall_updates")

    created = orm.Required(datetime)
    updated = orm.Optional(datetime)
    pending = orm.Required(bool)

    @classmethod
    def create(cls, group: SecurityGroup, node: Node):
        update = SecurityGroupUpdate(
            ref_security_group=SecurityGroup[group.id],
            ref_node=Node[node.id],
            created=datetime.now(),
            updated=datetime.now(),
            pending=True
        )
        update.flush()
