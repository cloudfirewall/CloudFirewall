from pony import orm
from pony.orm import PrimaryKey

from cloudfirewall.db import database


class Node(database.Entity):
    _table_ = 'plugin_nodes'

    id = PrimaryKey(int, auto=True)
    node_id = orm.Required(str)
    node_name = orm.Required(str)
    node_ip = orm.Required(str)
    timestamp = orm.Required(int)

    node_security_group = orm.Required("SecurityGroup", reverse="nodes")
    # pending_security_group = orm.Required("SecurityGroup", reverse="pending_nodes")
    firewall_updates = orm.Set("SecurityGroupUpdate", reverse="ref_node")

    @classmethod
    def get_by_node_id(cls, node_id):
        node = Node.get(node_id=node_id)
        if node:
            return Node[node.id]
        return None

    def json(self):
        return {
            "node_id": self.node_id,
            "node_name": self.node_name,
            "node_ip": self.node_ip,
            "timestamp": self.timestamp
        }


class PingHistory(database.Entity):
    _table_ = 'plugin_nodes_ping_history'

    id = PrimaryKey(int, auto=True)
    node_id = orm.Required(str)
    node_name = orm.Required(str)
    node_ip = orm.Required(str)
    timestamp = orm.Required(int)

    def json(self):
        return {
            "node_name": self.node_name,
            "node_ip": self.node_ip,
            "timestamp": self.timestamp
        }
