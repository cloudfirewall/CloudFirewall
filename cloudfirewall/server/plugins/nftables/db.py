from pony.orm import db_session, select, ObjectNotFound

from cloudfirewall.server.plugins.common.db import BaseDBService
from cloudfirewall.server.plugins.common.exceptions import ServerError
from cloudfirewall.server.plugins.heartbeat.entities import Node
from cloudfirewall.server.plugins.nftables.dto import CreateFirewallRequest, FirewallRuleRequest
from cloudfirewall.server.plugins.nftables.entities import SecurityGroup, SecurityGroupRule, SecurityGroupUpdate


class DatabaseService(BaseDBService):

    def __init__(self):
        super(DatabaseService, self).__init__()

    @db_session
    def create_firewall_group(self, create_request: CreateFirewallRequest):
        SecurityGroup.create(create_request)

    @db_session
    def list_firewall_groups(self):
        groups = select(sg for sg in SecurityGroup)[:]
        return groups

    @db_session
    def get_firewall_group(self, group_id):
        try:
            return SecurityGroup[group_id]
        except ObjectNotFound:
            return None
        except Exception as ex:
            self.logger.exception(ex)
            return None

    def update_firewall_group(self):
        pass

    def delete_firewall_group(self):
        pass

    @db_session
    def get_firewall_rule(self, rule_id):
        return SecurityGroup[rule_id]

    def add_rule_in_group(self, group, rule):
        try:
            SecurityGroupRule.create(group, rule)
        except Exception as ex:
            self.logger.exception(ex)
            raise ServerError("Failed to add firewall rule to a group")

    @db_session
    def update_rule_in_group(self, rule_ro: SecurityGroupRule, rule_request: FirewallRuleRequest):
        try:
            rule_rw = SecurityGroupRule[rule_ro.id]
            rule_rw.update_rule(rule_request)
        except Exception as ex:
            self.logger.exception(ex)
            raise ServerError("Failed to update rule in a group")

    @db_session
    def delete_rule_in_group(self, rule_ro: SecurityGroupRule):
        try:
            rule_rw = SecurityGroupRule[rule_ro.id]
            rule_rw.delete()
        except Exception as ex:
            self.logger.exception(ex)
            raise ServerError("Failed to delete rule in group")

    @db_session
    def apply_firewall_group(self, group: SecurityGroup, node: Node):
        try:
            SecurityGroupUpdate.create(group, node)
        except Exception as ex:
            self.logger.exception(ex)
            raise ServerError("Failed to apply firewall group to the node")
