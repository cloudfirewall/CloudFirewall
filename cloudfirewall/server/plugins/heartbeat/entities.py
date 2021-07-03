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

    def json(self):
        return {
            "node_id": self.node_id,
            "node_name": self.node_name,
            "node_ip": self.node_ip,
            "timestamp": self.timestamp
        }


class PingHistory(database.Entity):
    _table_ = 'plugin_heartbeat_ping_history'

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
