<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class ExchangeRatesController extends AbstractController
{
    public function getByDate(string $currencyCode, string $date, string $table = 'a')
    {
        $url = "https://api.nbp.pl/api/exchangerates/rates/{$table}/{$currencyCode}/{$date}/?format=json";
        try {
            $response = file_get_contents($url);
            if ($response === false) {
                throw new \Exception('Błąd podczas pobierania danych');
            }
            $data = json_decode($response, true);

            return isset($data['rates']) ? $data : [];
        } catch (\Exception $e) {
            return [];
        }
    }
    public function cantorDataPrepare(string $currency, string $operation, $nbpMidValue)
    {
        $returnNullValue = '';

        if (empty($nbpMidValue)) return $returnNullValue;
        switch ($currency) {
            case 'EUR':
            case 'USD':
                if ($operation == "ask") return ($nbpMidValue + 0.07);
                if ($operation == "bid") return ($nbpMidValue - 0.05);
            default:
                if ($operation == "ask") return ($nbpMidValue + 0.15);
                if ($operation == "bid") return $returnNullValue;
        }
    }
    public function getTable(Request $request): JsonResponse
    {
        $date = $request->query->get('date');
        $currencies = $request->query->get('currencies', []);
        $data = [];

        foreach ($currencies as $currency) {
            $resultByDateA = $this->getByDate($currency, $date);
            $resultTodayA = $this->getByDate($currency, date('Y-m-d'));
            $resultByDateC = $this->getByDate($currency, $date, 'c');
            $resultTodayC = $this->getByDate($currency, date('Y-m-d'), 'c');

            $data[$currency] = [
                "nbp" => [
                    "selected" => [
                        "ask" => $resultByDateC['rates'][0]['ask'] ?? 'Brak Danych w NBP',
                        "mid" => $resultByDateA['rates'][0]['mid'] ?? 'Brak Danych w NBP',
                        "bid" => $resultByDateC['rates'][0]['bid'] ?? 'Brak Danych w NBP',
                    ],
                    "today" => [
                        "ask" => $resultTodayC['rates'][0]['ask'] ?? 'Brak Danych w NBP',
                        "mid" => $resultTodayA['rates'][0]['mid'] ?? 'Brak Danych w NBP',
                        "bid" => $resultTodayC['rates'][0]['bid'] ?? 'Brak Danych w NBP',
                    ],
                ],
                "cantor" => [
                    "selected" => [
                        "ask" => $this->cantorDataPrepare($currency, "ask", $resultByDateA['rates'][0]['mid'] ?? null),
                        "bid" => $this->cantorDataPrepare($currency, "bid", $resultByDateA['rates'][0]['mid'] ?? null),
                    ],
                    "today" => [
                        "ask" => $this->cantorDataPrepare($currency, "ask", $resultTodayA['rates'][0]['mid'] ?? null),
                        "bid" => $this->cantorDataPrepare($currency, "bid", $resultTodayA['rates'][0]['mid'] ?? null),
                    ],
                ],
            ];
        }

        $response = new JsonResponse($data);
        // z powodu braku mozliwosci doinstalowania CORS globalnie dodajemy naglowki recznie 
        $response->headers->set('Access-Control-Allow-Origin', 'http://telemedi-zadanie.localhost');
        $response->headers->set('Access-Control-Allow-Methods', 'GET');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');

        return $response;
    }
}
