# Cloud Firewall
=================

Cloud Firewall provides firewall for distributed servers across 
different cloud providers. While each of the cloud providers have 
their own firewall solutions, it can be difficult to maintain consistency
across them. Cloud firewall provides a single dashboard to manage the 
firewall rules across all cloud providers.

Cloud firewall does not depend on the firewall service provided by the 
cloud providers, instead the firewall rules are applied at the individual 
server level using `nftables` package. In that sense, cloud firewall works
independently of the cloud providers.