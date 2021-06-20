import ast
import importlib
import os


class Plugin:

    def get_name(self):
        raise NotImplementedError("Name is not implemented")

    def get_servicer(self):
        raise NotImplementedError("Servicer is not implemented")

    def get_api_router(self):
        raise NotImplementedError("API Router is not implemented")


def register_plugins(plugin_root=None):
    global plugin_registry, plugin_registry_initialized
    if plugin_registry_initialized:
        return

    plugin_root = plugin_root or os.path.abspath(os.path.dirname(__file__))
    for plugin_dir in os.listdir(plugin_root):
        plugin_dir_path = os.path.join(plugin_root, plugin_dir)

        if os.path.isdir(plugin_dir_path):
            for plugin_file in os.listdir(plugin_dir_path):
                if plugin_file == 'plugin.py':
                    file_path = os.path.join(plugin_dir_path, plugin_file)

                    with open(file_path) as file:
                        node = ast.parse(file.read())

                    for class_node in node.body:
                        if isinstance(class_node, ast.ClassDef) and class_node.name.lower().endswith("plugin"):
                            pkg = importlib.import_module(f"cloudfirewall.server.plugins.{plugin_dir}.plugin")
                            plugin_class = getattr(pkg, class_node.name)
                            plugin_registry.add(plugin_class)

    plugin_registry_initialized = True


# Plugin registry registers all the plugins. To register the plugins, call
# register_plugins() function defined above.
plugin_registry = set()
plugin_registry_initialized = False
register_plugins()
