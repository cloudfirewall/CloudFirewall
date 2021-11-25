import logging.config
from pathlib import Path

import yaml

import cloudfirewall


class InfoFilter(logging.Filter):
    def filter(self, rec):
        return rec.levelno == logging.INFO


class ErrorFilter(logging.Filter):
    def filter(self, rec):
        return rec.levelno == logging.ERROR


def setup_logging():
    logger_file = (Path(cloudfirewall.__file__) / "../logger.yaml").resolve()
    print(f"logger file: {logger_file}")
    with open(str(logger_file), 'r') as stream:
        config = yaml.load(stream, Loader=yaml.FullLoader)
        logging.config.dictConfig(config)