from cloudfirewall.server.plugins import ServerPlugin
from cloudfirewall.server.plugins.heartbeat.servicer import HeartbeatServicer
from cloudfirewall.server.plugins.heartbeat import api as heartbeat_api


class HeartbeatPlugin(ServerPlugin):
    NAME = 'heartbeat'

    def __init__(self, server):
        super(HeartbeatPlugin, self).__init__()
        self.server = server

    def get_name(self):
        return self.NAME

    def get_servicer(self):
        return HeartbeatServicer(self.server)

    def get_api_router(self):
        return heartbeat_api.router
