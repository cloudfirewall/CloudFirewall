# Cloud Firewall
Cloud Firewall provides firewall for distributed servers across 
different cloud providers. While each of the cloud providers have 
their own firewall solutions, it can be difficult to maintain consistency
across them. Cloud firewall provides a single dashboard to manage the 
firewall rules across all cloud providers.

Cloud firewall does not depend on the firewall service provided by the 
cloud providers, instead the firewall rules are applied at the individual 
server level using `nftables` package. In that sense, cloud firewall works
independently of the cloud providers.

# Requirements
While enforcing and monitoring firewall is the main requirement for building
Cloud firewall, here are the additional requirements considered for the development:
- Be cloud independent.
- Be easy to deploy; Single server deployment.
- Be easy to create security groups, apply to servers and monitor them.
- Continuously monitor the servers for vulnerabilities
- Monitor unusual activities (or intrusions) from within the network (eg. port scanning, unusual processes, logins)
- Alert user on detecting suspicious activity

# Architecture
The architecture is based on agents. Firewall agents are installed on the 
client machines which communicate with the Firewall master server via GPRC.
The agents receive firewall rules from the server and apply them on the 
server. Further, the agents continuously monitor the server and reports 
to the master.

The firewall master server provides REST API to read the status and reports
of the individual connected servers which is presented in a web dashboard.

# Development
This software is under development and is not ready for use.

To run a development version:
1. Install the requirements.
```shell
pip3 install -r requirements.txt
```   
2. The communication between the GPRC server and the agents is done via GRPC
channel secured with certificates. So, first the certificate needs to be generated.
This step assumes that you have OpenSSL installed.   
```shell
scripts/gen-ca-cert.sh
scripts/gen-server-cert.sh
scripts/gen-agent-cert.sh
```

3. All GPRC communication is defined in `.proto` files inside `proto` directory.
The wrapper for these proto files needs to be generated.
```shell
scripts/build-proto.sh
```

4. Create `.env` file by copying `.env_example`. Make sure to make 
   appropriate changes in the file to suit your needs.
```shell
cp .env_example .env
```   
   
5. Run the firewall server
```shell
python3 cloudfirewall/server/grpc_server.py
```

6. Run the agent
```shell
python3 cloudfirewall/agent/grpc_client.py
```

# License
Cloud Firewall is free and the source is available under the Server 
Side Public License (SSPL) v1 License.