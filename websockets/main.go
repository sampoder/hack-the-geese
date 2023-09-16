package main

import (
	"fmt"
	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
	"log"
	"net/http"
	"time"
	"encoding/json"
)

type Event struct {
	Action string
	Origin string
	Target *string
	Battle *string
}

func main() {
	handler := http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		var resp []byte
		log.Println("hi!")
		if req.URL.Path == "/handler" {
			conn, _, _, err := ws.UpgradeHTTP(req, rw)
			log.Println("hi!")
			if err != nil {
				log.Println("Error with WebSocket: ", err)
				rw.WriteHeader(http.StatusMethodNotAllowed)
				return
			}
			go func() {
				defer conn.Close()
				time.Sleep(time.Second)
				err = wsutil.WriteServerMessage(conn, ws.OpText, []byte(`{"text": "connection-established"}`))
				if err != nil {
					log.Println("Error writing WebSocket data: ", err)
					return
				}
				for {
					msg, op, err := wsutil.ReadClientData(conn)
					if err != nil {
						log.Println("Error reading WebSocket data: ", err)
					}
					var event Event	
					json.Unmarshal([]byte(msg), &event)
					log.Println(event.Action)
					err = wsutil.WriteServerMessage(conn, op, msg)
					if err != nil {
						log.Println("Error writing WebSocket data: ", err)
					}
				}
			}()
			return
		}
		rw.Header().Set("Content-Type", "application/json")
		rw.Header().Set("Content-Length", fmt.Sprint(len(resp)))
		rw.Write(resp)
	})

	log.Println("Server is available at http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", handler))
}