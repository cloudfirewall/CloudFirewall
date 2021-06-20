from cloudfirewall.server.plugins import ServerPlugin
from cloudfirewall.server.plugins.nftables.servicer import FirewallServicer


class NFTablesPlugin(ServerPlugin):
    NAME = 'nftables'

    def __init__(self, server):
        super(NFTablesPlugin, self).__init__()
        self.server = server

    def get_name(self):
        return self.NAME

    def get_servicer(self):
        return FirewallServicer(self.server)

    def get_api_router(self):
        return None
