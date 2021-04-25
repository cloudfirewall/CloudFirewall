from pathlib import Path


def resolve_path(relative_path):
    """
    Resolves the given path to the project root directory.
    If the path is an absolute path, it returns as it is.
    :param relative_path: Path to resolve
    :return: Resolved absolute path
    """
    relative_path = Path(relative_path)
    if relative_path.is_absolute():
        return relative_path

    root_path = (Path(__file__)/"../../../").resolve()
    return root_path / relative_path
