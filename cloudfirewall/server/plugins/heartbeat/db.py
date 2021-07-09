import time

from pony.orm import db_session, select, ObjectNotFound

from cloudfirewall.server.plugins.common.db import BaseDBService
from cloudfirewall.server.plugins.heartbeat.entities import Node, PingHistory
from cloudfirewall.server.plugins.nftables.entities import SecurityGroup


class DatabaseService(BaseDBService):

    def __init__(self):
        super(DatabaseService, self).__init__()

    @db_session
    def get_node_by_id(self, node_id):
        try:
            return Node.get(node_id=node_id)
        except ObjectNotFound:
            return None
        except Exception as ex:
            self.logger.exception(ex)
            return None

    @db_session
    def save_ping_request(self, ping_request, context):
        node_ip = self._get_peer_ip(context.peer())
        self.update_ping_status(ping_request, node_ip)
        self.save_to_ping_history(ping_request, node_ip)

    @db_session
    def update_ping_status(self, ping_request, node_ip):
        ping_status = Node.get(node_id=ping_request.node_id, node_ip=node_ip)
        if ping_status:
            ping_status = Node[ping_status.id]
            ping_status.node_name = ping_request.node_name
            ping_status.timestamp = int(time.time())
        else:
            Node(
                node_id=ping_request.node_id,
                node_name=ping_request.node_name,
                node_ip=node_ip,
                timestamp=int(time.time()),
                node_security_group=SecurityGroup.get_default()
            )

    @db_session
    def save_to_ping_history(self, ping_request, node_ip):
        PingHistory(
            node_id=ping_request.node_id,
            node_name=ping_request.node_name,
            node_ip=node_ip,
            timestamp=int(time.time())
        )

    @db_session
    def get_nodes_status(self):
        ping_statuses = select(p for p in Node)[:]
        return ping_statuses

    @db_session
    def get_ping_history(self, node_ip: str, from_ts: int = None, to_ts: int = None):
        try:
            now = int(time.time())
            from_ts = from_ts or now - 30 * 24 * 60 * 60
            to_ts = to_ts or now
            ping_history = select(h for h in PingHistory
                                  if h.node_ip == node_ip
                                  and h.timestamp >= from_ts
                                  and h.timestamp <= to_ts)[:]
            return ping_history
        except Exception as ex:
            self.logger.exception("Failed to get ping history", ex)
            return []
