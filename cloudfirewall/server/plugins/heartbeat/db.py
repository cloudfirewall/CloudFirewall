import logging
import time

from pony.orm import db_session, select

from cloudfirewall.server.plugins.heartbeat.entities import PingStatus, PingHistory


class DatabaseService:

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def _get_peer_ip(self, peer_address):
        if peer_address.startswith("ipv4:"):
            splits = peer_address.split(":")
            return splits[1]
        return "N/A"

    @db_session
    def save_ping_request(self, ping_request, context):
        node_ip = self._get_peer_ip(context.peer())
        self.update_ping_status(ping_request, node_ip)
        self.save_to_ping_history(ping_request, node_ip)

    @db_session
    def update_ping_status(self, ping_request, node_ip):
        ping_status = PingStatus.get(node_id=ping_request.node_id, node_ip=node_ip)
        if ping_status:
            ping_status = PingStatus[ping_status.id]
            ping_status.node_name = ping_request.node_name
            ping_status.timestamp = int(time.time())
        else:
            PingStatus(
                node_id=ping_request.node_id,
                node_name=ping_request.node_name,
                node_ip=node_ip,
                timestamp=int(time.time())
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
        ping_statuses = select(p for p in PingStatus)[:]
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
