import ast
import importlib
import os


def register_plugins(plugin_root, plugin_package_root, registry, plugin_filename='plugin.py'):
    for plugin_dir in os.listdir(plugin_root):
        plugin_dir_path = os.path.join(plugin_root, plugin_dir)

        if os.path.isdir(plugin_dir_path):
            for plugin_file in os.listdir(plugin_dir_path):
                if plugin_file == plugin_filename:
                    file_path = os.path.join(plugin_dir_path, plugin_file)

                    with open(file_path) as file:
                        node = ast.parse(file.read())

                    for class_node in node.body:
                        if isinstance(class_node, ast.ClassDef) and class_node.name.lower().endswith("plugin"):
                            pkg = importlib.import_module(f"{plugin_package_root}.{plugin_dir}.plugin")
                            plugin_class = getattr(pkg, class_node.name)
                            registry.add(plugin_class)
