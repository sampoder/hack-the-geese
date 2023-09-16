package main

import (
	"fmt"
	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
	"log"
	"net/http"
	"time"
	"encoding/json"
	"websockets/db"
	"context"
	"errors"
)

type Event struct {
	Action string
	Origin string
	Target *string
	Battle *string
	Goose *string
	Attachment *string
}

func main() {
	
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		panic(err)
	}
	
	ctx := context.Background()
	
	var currentEvent Event	
	
	var currentMsg []byte
	
	handler := http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		var resp []byte
		log.Println("hi!")
		var latestEvent Event	
		if req.URL.Path == "/handler" {
			conn, _, _, err := ws.UpgradeHTTP(req, rw)
			log.Println("hi!")
			if err != nil {
				log.Println("Error with WebSocket: ", err)
				rw.WriteHeader(http.StatusMethodNotAllowed)
				return
			}
			go func() {
				for {
					msg, op, err := wsutil.ReadClientData(conn)
					if err != nil {
						log.Println("Error reading WebSocket data: ", err)
						conn.Close()
						return
					}
					var event Event	
					json.Unmarshal([]byte(msg), &event)
					log.Println(event.Action)
					currentEvent = event
					currentMsg = msg
					err = wsutil.WriteServerMessage(conn, op, []byte(`{"text": "connection-established"}`))
					if err != nil {
						log.Println("Error writing WebSocket data: ", err)
						conn.Close()
						return
					}
				}
			}()
			go func() {
				
				time.Sleep(time.Second)

				for {
					if(latestEvent != currentEvent){
						var event Event	= currentEvent
						latestEvent = event
						if event.Action == "player_join" {
							player, err := client.Player.FindFirst(
								db.Player.ID.Equals(event.Origin),
							).Exec(ctx)
							if errors.Is(err, db.ErrNotFound) {
								_, err := client.Player.CreateOne(
									db.Player.ID.Set(event.Origin),
									db.Player.Score.Set(0),
								).Exec(ctx)
								if err != nil {
									log.Println("Error creating new player: ", err)
								}
								err = wsutil.WriteServerMessage(conn, ws.OpText, []byte(fmt.Sprintf(`{"action": "new_player_connected", "origin": "%s"}`, event.Origin)))
								if err != nil {
									log.Println("Error writing WebSocket data: ", err)
								}
							} else if err != nil {
								log.Printf("error occurred: %s", err)
							} else {
								log.Println("Error writing WebSocket data: ",  player.Goose)
								err = wsutil.WriteServerMessage(conn, ws.OpText, []byte(fmt.Sprintf(`{"action": "player_connected", "origin": "%s"}`, event.Origin)))
								if err != nil {
									log.Println("Error writing WebSocket data: ", err)
								}
							}
							
						} else if event.Action == "new_battle" || event.Action == "rematch_consent" {
							if event.Action == "rematch_consent" {
								event.Action = "new_battle"
								event.Origin, event.Target = *event.Target, &event.Origin
							}
							
							targets, err := client.Player.FindMany(
								db.Player.ID.Equals(*event.Target),
							).Exec(ctx)
							if len(targets) == 0 {
								err = wsutil.WriteServerMessage(conn, ws.OpText, []byte(fmt.Sprintf(`{"action": "missing_target", "target": "%s"}`, *event.Target)))
								if err != nil {
									log.Println("Error writing WebSocket data: ", err)
								}
							} else {
								battle, err := client.Battle.CreateOne(
									db.Battle.PlayerOne.Link(
										db.Player.ID.Equals(event.Origin),
									),
									db.Battle.PlayerTwo.Link(
										db.Player.ID.Equals(*event.Target),
									),
								).Exec(ctx)
								log.Println("wating!")
								err = wsutil.WriteServerMessage(conn, ws.OpText, []byte(fmt.Sprintf(`{"action": "waiting_for_opponent", "origin": "%s", "target": "%s", "battle": "%s"}`, event.Origin, *event.Target, battle.ID)))
								if err != nil {
									log.Println("Error writing WebSocket data: ", err)
								}
							}
						} else if event.Action == "submission" {
							battle, err := client.Battle.FindFirst(
								db.Battle.ID.Equals(*event.Battle),
							).Exec(ctx)
							if err != nil {
								log.Println("Error fetching battle: ", err)
							}
							log.Println("Error updating battle: ", event.Origin)
							if battle.PlayerOneID == event.Origin {
								_, err := client.Battle.FindUnique(
									db.Battle.ID.Equals(*event.Battle),
								).Update(
									db.Battle.WinningPhoto.Set(*event.Attachment),
									db.Battle.Winner.Set("PLAYER1"),
								).Exec(ctx)
								if err != nil {
									log.Println("Error updating battle: ", err)
								}
							} else if battle.PlayerTwoID == event.Origin {
								_, err := client.Battle.FindUnique(
									db.Battle.ID.Equals(*event.Battle),
								).Update(
									db.Battle.WinningPhoto.Set(*event.Attachment),
									db.Battle.Winner.Set("PLAYER2"),
								).Exec(ctx)
								if err != nil {
									log.Println("Error updating battle: ", err)
								}
							}
							err = wsutil.WriteServerMessage(conn, ws.OpText, currentMsg)
							if err != nil {
								log.Println("Error writing WebSocket data: ", err)
							}
						} else if event.Action == "opponent_ready" {
							log.Println("Error updating battle: ", event.Origin)
							err = wsutil.WriteServerMessage(conn, ws.OpText, []byte(fmt.Sprintf(`{"action": "opponent_ready", "battle": "%s", "prompt": "%s", "origin": "%s", "target": "%s"}`, *event.Battle, "Here's a random prompt!", event.Origin, *event.Target )))
							if err != nil {
								log.Println("Error writing WebSocket data: ", err)
							}
						} else if event.Action == "rematch_request" {
							err = wsutil.WriteServerMessage(conn, ws.OpText, currentMsg)
							if err != nil {
								log.Println("Error writing WebSocket data: ", err)
							}
						} else if event.Action == "goose_color_selected" {
							_, err := client.Player.FindUnique(
								db.Player.ID.Equals(event.Origin),
							).Update(
								db.Player.Goose.Set(*event.Goose),
							).Exec(ctx)
							if err != nil {
								log.Println("Error updating player: ", err)
							}
							err = wsutil.WriteServerMessage(conn, ws.OpText, currentMsg)
							if err != nil {
								log.Println("Error writing WebSocket data: ", err)
							}
						} else {
							err = wsutil.WriteServerMessage(conn, ws.OpText, currentMsg)
							if err != nil {
								log.Println("Error writing WebSocket data: ", err)
								conn.Close()
							}
						}
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