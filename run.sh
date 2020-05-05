PORTS=(3000 5000)

for PORT in ${PORTS[@]}; do
  PID=$( lsof -i :$PORT | awk '{ print $2 }' | sed 's/PID//g' | sed -n '2 p' )

  if [ -n "$PID" ]; then
    kill "$PID"
  fi
done

cd ./server
npm run start &

sleep 3

cd ../client
npm run start
