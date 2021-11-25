from cloudfirewall.agent.plugins import AgentPlugin
from cloudfirewall.agent.plugins.nftables.service import FirewallService


class NFTablesPlugin(AgentPlugin):
    NAME = 'nftables'

    def __init__(self, agent, channel):
        super(NFTablesPlugin, self).__init__()
        self.agent = agent
        self.channel = channel

    def get_name(self):
        return self.NAME

    def get_service(self):
        return FirewallService(self.agent, self.channel)
