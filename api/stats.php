<?php
header("Content-Type: application/json");
$credentials = require(__DIR__ . '/credentials.php');

function is_valid_url($url) {
    if (preg_match('/\\A(\\/|(\\/[a-zA-Z0-9\\-]+)+)\\Z/', $url) !== 1) {
        return false;
    }
    if (!file_exists(__DIR__ . '/..' . $url . ".html") && !file_exists(__DIR__ . '/..' . $url . "/index.html")) {
        return false;
    }
    return true;
}

function getJsonUrl($url) {
    $ch = curl_init($url);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($ch,CURLOPT_USERAGENT,'pasztor.at website');
    $data = curl_exec($ch);
    $status = curl_getinfo($ch,CURLINFO_HTTP_CODE);
    if ($status !== 200) {
        return null;
    }
    return json_decode($data, true);
}

function getFacebookCount($url, $accessToken, $appSecret) {
    $appsecretProof = hash_hmac('sha256', $accessToken, $appSecret);

    $decodedData = getJsonUrl('https://graph.facebook.com?id=' .
        urlencode($url) .
        '&fields=og_object{engagement}&access_token=' .
        urlencode($accessToken) .
        '&appsecret_proof=' . urlencode($appsecretProof)
    );
    if ($decodedData === null ||
        !isset($decodedData['og_object']) ||
        !isset($decodedData['og_object']['engagement']) ||
        !isset($decodedData['og_object']['engagement']['count']) ||
        $decodedData['og_object']['engagement']['count'] === null
    ) {
        return null;
    }
    return (int)$decodedData['og_object']['engagement']['count'];
}

function getRedditCount($url) {
    $decodedData = getJsonUrl('https://www.reddit.com/api/info.json?url=' .
        urlencode($url)
    );
    if ($decodedData === null ||
        !isset($decodedData['data']) ||
        !isset($decodedData['data']['children']) ||
        !is_array($decodedData['data']['children'])
    ) {
        return null;
    }
    return count($decodedData['data']['children']);
}

function getTwitterCount($url) {
    $decodedData = getJsonUrl('https://public.newsharecounts.com/count.json?url=' .
        urlencode($url)
    );
    if ($decodedData === null || !isset($decodedData['count']) || $decodedData['count'] === null) {
        return null;
    }
    return (int)$decodedData['count'];
}

function getHackerNewsUrlAndCount($url) {
    $decodedData = getJsonUrl('https://hn.algolia.com/api/v1/search?query=' .
        urlencode($url)
    );
    if ($decodedData === null || !isset($decodedData['hits'])) {
        return null;
    }

    $points = 0;
    $latestUrl = null;
    foreach ($decodedData['hits'] as $hit) {
        if (isset($hit['objectID'])) {
            $latestUrl = 'https://news.ycombinator.com/item?id=' . urlencode($hit['objectID']);
        }
        if (isset($hit['points'])) {
            $points += ((int)$hit['points']);
        }
    }

    return ['count' => $points, 'url' => $latestUrl];
}


$_GET['url'] = str_replace(".html", "", $_GET['url']);
if (!isset($_GET['url'])) {
    header("HTTP/1.1 400 Bad Request");
    echo(json_encode(['error' => 'The url parameter is required']));
    exit;
}
if (!is_valid_url($_GET['url'])) {
    header("HTTP/1.1 400 Bad Request");
    echo(json_encode(['error' => 'The url parameter does not contain an URL to a valid blog post.']));
    exit;
}

$_GET['url'] = 'https://pasztor.at' . $_GET['url'];

echo(json_encode([
    'hackernews' => getHackerNewsUrlAndCount($_GET['url']),
    'facebook' => ['count' => getFacebookCount($_GET['url'], $credentials['facebook']['access_token'], $credentials['facebook']['app_secret']), 'url' => null],
    'reddit' => ['count' => getRedditCount($_GET['url']), 'url' => null],
    'twitter' => ['count' => getTwitterCount($_GET['url']), 'url' => null],
    'pocket' => ['count' => null, 'url' => null],
    'messenger' => ['count' => null, 'url' => null],
    'gplus' => ['count' => null, 'url' => null],
    'tumblr' => ['count' => null, 'url' => null],
    'linkedin' => ['count' => null, 'url' => null],
    'vk' => ['count' => null, 'url' => null],
    'wordpress' => ['count' => null, 'url' => null],
]));