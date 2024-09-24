<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Goutte\Client;
use GuzzleHttp\Client as GuzzleClient;
class CrawlerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $client = new Client();
        $baseUrl = 'https://vnexpress.net';
        $crawler = $client->request('GET', $baseUrl);

        $articles = $crawler->filter('article.item-news')->each(function ($node) use ($client, $baseUrl) {
            $title = $node->filter('h3.title-news')->count() > 0 ? trim($node->filter('h3.title-news')->text()) : null;
            $summary = $node->filter('p.description')->count() > 0 ? trim($node->filter('p.description')->text()) : null;

            $imgElement = $node->filter('img[itemprop="contentUrl"]');
            $imageUrl = $imgElement->count() > 0 ? $imgElement->attr('src') : null;

            if ($imageUrl && strpos($imageUrl, 'data:image') === 0) {
                $imageUrl = $imgElement->attr('data-src');
            }

            $slug = null;
            if ($node->filter('h3.title-news a')->count() > 0) {
                $href = $node->filter('h3.title-news a')->attr('href');
                $slug = $href ? parse_url($href, PHP_URL_PATH) : null;
            }

            $content = null;
            if ($slug) {
                $articleUrl = $baseUrl . $slug;
                try {
                    $detailCrawler = $client->request('GET', $articleUrl);
                    $content = $detailCrawler->filter('.sidebar-1')->count() > 0
                        ? trim($detailCrawler->filter('.sidebar-1')->text())
                        : null;
                } catch (\Exception $e) {
                    $this->error("Error fetching content for URL: {$articleUrl}. " . $e->getMessage());
                }
            }
            $data=[
                'title' => $title,
                'summary' => $summary ? preg_replace('/[\t\n]+/', ' ', trim($summary)) : null,
                'image' => $imageUrl,
                'slug' => ltrim($slug, '/'),
            ];
            $rewrittenContent = $this->rewriteContentInVietnamese($content,$data);
            
        });
        $validArticles = array_filter($articles, function ($article) {
            return $article['title'] && $article['summary'] && $article['imageUrl'] && $article['content'];
        });

        return response()->json($validArticles);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function rewriteContentInVietnamese($content, $data)
    {
        if (!$content) {
            return null;
        }
        $apiKey = env('OPENAI_API_KEY'); 

        if (!$apiKey) {
            throw new \Exception('OpenAI API key is missing.');
        }
        $client = new GuzzleClient();
        // Use Guzzle to make the POST request
        $response = $client->post('https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => 'gpt-3.5-turbo',  // Or GPT-4 if you have access
                'messages' => [
                    ['role' => 'user', 'content' => "Translate the following content into Vietnamese and maintain the same meaning:\n$content"], // Fixed formatting
                ],
                'temperature' => 0.7, // Creativity level of the result
            ],
        ]);

        $body = json_decode($response->getBody(), true);
        if (isset($body['choices'][0]['message']['content'])) {
            $data['content'] = $body['choices'][0]['message']['content'];
            $data['created_at']= now();
            Post::create($data);
        }
        
        return null; // Return null if no content is found
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
