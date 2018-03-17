<?php
declare(strict_types=1);

require_once __DIR__ . "/vendor/autoload.php";

$settings = require(__DIR__ . '/.socialproof-credentials.php');

class SocialProofEntry {
    private $platform;
    private $shareLink;
    private $articleLink;

    public function __construct(string $platform, string $shareLink, string $articleLink) {
        $this->platform = $platform;
        $this->shareLink = $shareLink;
        $this->articleLink = $articleLink;
    }

    public function getPlatform(): string {
        return $this->platform;
    }

    public function getShareLink(): string {
        return $this->shareLink;
    }

    public function getArticleLink(): string {
        return $this->articleLink;
    }
}

/**
 * @param $settings
 * @throws Exception
 *
 * @return SocialProofEntry[]
 */
function gatherTweets($settings) {
    $url = 'https://api.twitter.com/1.1/search/tweets.json';
    $getField = '?q=' . urlencode('pasztor.at') . '&count=100&result_type=recent';
    $requestMethod = 'GET';

    $twitter = new TwitterAPIExchange($settings);
    /** @noinspection PhpUnhandledExceptionInspection */
    $response = $twitter
        ->setGetfield($getField)
        ->buildOauth($url, $requestMethod)
        ->performRequest();
    $responseObject = json_decode($response, true);
    $entries = [];
    foreach ($responseObject['statuses'] as $status) {
        foreach ($status['entities']['urls'] as $url) {
            if (
                substr(
                    $url['expanded_url'],
                    0,
                    strlen('https://pasztor.at/')
                ) == "https://pasztor.at/"
            ) {
                $entries[] = new SocialProofEntry(
                    "twitter",
                    'https://twitter.com/' .
                        urlencode($status['user']['screen_name']) .
                        '/status/' .
                        urlencode($status['id_str']),
                    $url['expanded_url']
                );
            }
        }
    }

    return $entries;
}

/** @noinspection PhpUnhandledExceptionInspection */
$tweets = gatherTweets($settings['twitter']);

var_dump($tweets);