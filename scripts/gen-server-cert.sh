# Run this script from the project root directory.
# Otherwise, the certificates will be generated in the wrong
# directory. The correct path for the certificates
# is <project_root>/certs

SERVER_CN=localhost

openssl req -nodes -newkey rsa:4096 \
    -keyout certs/cloud-server.key \
    -out certs/cloud-server.csr \
    -subj /CN=$SERVER_CN

openssl x509 -req \
    -in certs/cloud-server.csr \
    -CA certs/cloud-ca.pem \
    -CAkey certs/cloud-ca.key \
    -set_serial 1 \
    -out certs/cloud-server.pem
