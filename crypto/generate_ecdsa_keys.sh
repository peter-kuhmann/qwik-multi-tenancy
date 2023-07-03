#!/bin/sh
# Switch to current directory
cd "$(dirname "$0")"

# Our curve is prime256v1
openssl ecparam -name prime256v1 -genkey -noout -out jwtES256.key
openssl ec -in jwtES256.key -pubout -out jwtES256.key.pub

# Export generated keys
cat <<EOF > ./.env.vars
# JWT signing
JWT_PRIVATE_KEY="$(awk '{printf "%s\\n",$0} END {print ""}' ./jwtES256.key)"
JWT_PUBLIC_KEY="$(awk '{printf "%s\\n",$0} END {print ""}' ./jwtES256.key.pub)"
EOF

echo ""
echo "✅ Env variables exported to file: ./.env.vars"