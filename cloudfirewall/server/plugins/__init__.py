import os

from cloudfirewall.common.plugin_helper import register_plugins


class ServerPlugin:

    def get_name(self):
        raise NotImplementedError("Name is not implemented")

    def get_servicer(self):
        raise NotImplementedError("Servicer is not implemented")

    def get_api_router(self):
        raise NotImplementedError("API Router is not implemented")


def register_server_plugins():
    global server_plugin_registry, server_plugin_registry_initialized
    if server_plugin_registry_initialized:
        return

    plugin_root = os.path.abspath(os.path.dirname(__file__))
    plugin_package_root = "cloudfirewall.server.plugins"
    register_plugins(plugin_root, plugin_package_root, server_plugin_registry, plugin_filename='plugin.py')
    server_plugin_registry_initialized = True


# ServerPlugin registry registers all the plugins. To register the plugins, call
# register_server_plugins() function defined above.
server_plugin_registry = set()
server_plugin_registry_initialized = False
register_server_plugins()
