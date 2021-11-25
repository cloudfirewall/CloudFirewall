import ast
import importlib
import os

from cloudfirewall.common.plugin_helper import register_plugins


class AgentPlugin:

    def get_name(self):
        raise NotImplementedError("Name is not implemented")

    def get_service(self):
        raise NotImplementedError("Servicer is not implemented")


def register_agent_plugins():
    global agent_plugin_registry, agent_plugin_registry_initialized
    if agent_plugin_registry_initialized:
        return

    plugin_root = os.path.abspath(os.path.dirname(__file__))
    plugin_package_root = "cloudfirewall.agent.plugins"
    register_plugins(plugin_root, plugin_package_root, agent_plugin_registry, plugin_filename='plugin.py')
    agent_plugin_registry_initialized = True


# ServerPlugin registry registers all the plugins. To register the plugins, call
# register_plugins() function defined above.
agent_plugin_registry = set()
agent_plugin_registry_initialized = False
register_agent_plugins()
