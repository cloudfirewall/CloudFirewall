# Run this script from the project root directory.
# Otherwise, the gprc files will be generated in the wrong
# directory.

python -m grpc_tools.protoc -I proto   --python_out=.   --grpc_python_out=.  proto/cloudfirewall/grpc/*.proto