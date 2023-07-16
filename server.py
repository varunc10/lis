import asyncio
import websockets

clients = set()
blink_count = 0


async def receive_blink(websocket, path):
    clients.add(websocket)
    global blink_count
    async for message in websocket:
        if message == 'blink':
            blink_count += 1
            for client in clients:
                await client.send(blink_count)

start_server = websockets.serve(receive_blink, 'localhost', 8000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
