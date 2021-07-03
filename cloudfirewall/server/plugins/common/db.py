import logging
import time

from pony.orm import db_session, select

from cloudfirewall.server.plugins.heartbeat.entities import PingStatus, PingHistory


class BaseDBService:

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def _get_peer_ip(self, peer_address):
        if peer_address.startswith("ipv4:"):
            splits = peer_address.split(":")
            return splits[1]
        return "N/A"
