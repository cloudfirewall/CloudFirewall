# Run this script from the project root directory.
# Otherwise, the certificates will be generated in the wrong
# directory. The correct path for the certificates
# is <project_root>/certs

AGENT_CN=localhost

openssl req -nodes -newkey rsa:4096 \
    -keyout certs/cloud-agent.key \
    -out certs/cloud-agent.csr \
    -subj /CN=$AGENT_CN

openssl x509 -req \
    -in certs/cloud-agent.csr \
    -CA certs/cloud-ca.pem \
    -CAkey certs/cloud-ca.key \
    -set_serial 1 \
    -out certs/cloud-agent.pem
