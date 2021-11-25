import os
import time
from random import random

from pony import orm

database = orm.Database()

time.sleep(random())  # to prevent all workers calling generate_mapping at the same time
database.bind('sqlite', os.environ.get('CF_SERVER_DB', 'cf_server.db'), create_db=True)
# database.generate_mapping(create_tables=True)
orm.sql_debug(False)
