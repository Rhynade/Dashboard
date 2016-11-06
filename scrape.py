import pandas as pd
import requests
import time

def get_all_info(location_id):
    have_next_page = True
    posts={}
    err_count = 0
    count = 0
    codes = set()

    r = requests.get("https://www.instagram.com/explore/locations/{}/".format(location_id))
    last_item = int(r.text.split("\"end_cursor\": \"")[1].split("\",")[0])
    while have_next_page and err_count < 3:
        curr_number_of_posts = len(codes)
        # Code to query the page
        try:
            headers = {
                'cookie': 'mid=V4EEeAAEAAGoq9I1MDU807pTkQRy; fbm_124024574287414=base_domain=.instagram.com; s_network=magix; sessionid=IGSCe317d5f749358789ccb7c41e6a6d820b84b41f47f28307891b2c0f30994b3c1e%3AdbpK3JEowuFzkE6wQSyINWeKxClngrc1%3A%7B%22asns%22%3A%7B%2242.61.246.233%22%3A9506%2C%22time%22%3A1473346113%7D%7D; ig_pr=1.5; ig_vw=623; fbsr_124024574287414=IJcsrYX8WV8mvsIzgP9fsyxuyzu3XXby6ZwrKMfvkJE.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUItSUVHMjFKc3E3RmFfOUNPSzRmYmxqcW5QOGhxNW9aYVNraENrdHkyRHNTSGN5NGxyRFcwTS1UTzJBXzVseTZuRG1rUFUtWHliX2ViM2dITlNKZTh6Y19hdjdhWE9aOVFZenR0eUx2Y2VsWmRmcHBiMzNXZDVweGpQQ2U3MEswbjJWSUJVVUVVZmZKMC1peC1fNVdjODl1UUE1b1VkS2xYeHpjSDBSOHp0RWhDNnhWZ2gteEp1YnFqM0NPc0lWaXhUV2NKUXFRckNXZzJhdWdwR21jdXM1MlY1d0Zyc1ZUcTRzaGR1YWs5Y3Z5QVFBVEFtM2JEVEYzbXE1eFdLSWZPNHhJWE1UNmR6Ry1HR0ppSG9XTGVaM0tCSThhaGltaXFma2UySnBsNlRMYTRNZFVMclQxVmdTVlV3U2xsUW5aVlkwNUJZcURQV0hKWjdoWmVHeUJhdCIsImlzc3VlZF9hdCI6MTQ3MzM0NjExNiwidXNlcl9pZCI6IjY0ODkyMzk4OSJ9; csrftoken=gRGjQTCuDsPVbstF0vRVjcUUAHnOukLV',
                'origin': 'https://www.instagram.com',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.8',
                'user-agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest',
                'x-csrftoken': 'gRGjQTCuDsPVbstF0vRVjcUUAHnOukLV',
                'x-instagram-ajax': '1',
                'content-type': 'application/x-www-form-urlencoded',
                'accept': '*/*',
                'referer': 'https://www.instagram.com/explore/locations/{}/'.format(location_id),
                'authority': 'www.instagram.com',
            }

            data = 'q=ig_location({})+%7B+media.after({}%2C+12)+%7B%0A++count%2C%0A++nodes+%7B%0A++++caption%2C%0A++++code%2C%0A++++comments+%7B%0A++++++count%0A++++%7D%2C%0A++++comments_disabled%2C%0A++++date%2C%0A++++dimensions+%7B%0A++++++height%2C%0A++++++width%0A++++%7D%2C%0A++++display_src%2C%0A++++id%2C%0A++++is_video%2C%0A++++likes+%7B%0A++++++count%0A++++%7D%2C%0A++++owner+%7B%0A++++++id%0A++++%7D%2C%0A++++thumbnail_src%2C%0A++++video_views%0A++%7D%2C%0A++page_info%0A%7D%0A+%7D&ref=locations%3A%3Ashow'.format(location_id, last_item)

            r = requests.post('https://www.instagram.com/query/', headers=headers, data=data)

            # Update next page status
            retrieved_info = r.json()
            if 'media' not in retrieved_info.keys():
                print(retrieved_info)
                raise ValueError('media key not found')
            else:
                temp_last_item = retrieved_info['media']['page_info']['end_cursor']
                if temp_last_item:
                    last_item = temp_last_item
                nodes = r.json().get('media').get('nodes')
                for node in nodes:
                    code = node.get('code')
                    date = int(node.get('date'))
                    #likes = int(node.get('likes').get('count'))
                    if node.get('caption'):
                        caption = node.get('caption').encode('utf-8')
                    else:
                        caption = ''
                    posts[code] = (date, caption)

                count += 1
                print(count, ": ", len(posts), last_item)

                if date < 1451606401:
                    have_next_page = False
                else:
                    have_next_page = retrieved_info['media']['page_info']['has_next_page']
                if not have_next_page:
                    print('Reached the end')
                    return posts
                if len(posts) > curr_number_of_posts:
                    err_count = 0
                else:
                    err_count +=1

        except Exception as e:
            print(e)
            print("Waiting...", last_item)
            time.sleep(60)
            err_count += 1

    return posts


def save_data_to_json(location_id):
    data=get_all_info(location_id)
    k = pd.DataFrame.from_dict(data,orient='index')
    k['date_posted'] = pd.to_datetime(k[0], unit='s')
    k = k.groupby([pd.Grouper(freq='1M',key='date_posted')]).size()
    k = k.reset_index(level=0, inplace=False)
    k[:-1].to_json("data/{}.json".format(location_id), orient='records', date_format='iso')
    return k

from multiprocessing import Pool
if __name__ == '__main__':
    location_ids1 = [
    5325941,
    162869006,
    164558236,
    327556374,
    223877583]

    
    # 1018904002,
    # 108007442,

    location_ids2 = [
    223877583,
    214353560,
    215645442,
    941978268,
    236177002,
    577039973,
    215001869,
    125575547,
    947616497]

    location_ids3 = [219017329,
    1620180,
    214431872,
    25337867,
    887519929,
    293644117,
    925834907,
    755623225,
    463698221,
    39661913,
    214972245,
    212947426,
    474754329,
    330498308]

    location_ids4 = [1019237300,
    1018911512,
    518354426,
    354527828,
    26584579,
    92185357,
    1029664860,
    18120632,
    765965619,
    2956941,
    638207000,
    119294,
    4993427,
    213041801,
    214243012,
    212965941,
    85555692,
    5837348,
    450940409,
    310506255979054
    ]

    for i in location_ids1:
        save_data_to_json(i)


