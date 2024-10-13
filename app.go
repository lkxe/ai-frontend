package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	_ "github.com/joho/godotenv/autoload"
	"io/ioutil"
	"net/http"
	"os"
)

// App struct
type App struct {
	ctx context.Context
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

type AnthropicRequest struct {
	Model     string    `json:"model"`
	MaxTokens int       `json:"max_tokens"`
	Messages  []Message `json:"messages"`
}

type AnthropicResponse struct {
	Content []struct {
		Text string `json:"text"`
	} `json:"content"`
}

type OpenAIRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type OpenAIResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func (a *App) SendMessage(model string, message string, useCaching bool) (string, error) {
	fmt.Printf("SendMessage called with model: %s, message: %s, useCaching: %v\n", model, message, useCaching)

	var apiKey string
	var apiEndpoint string
	var responseText string

	switch model {
	case "claude":
		apiKey = os.Getenv("ANTHROPIC_API_KEY")
		if apiKey == "" {
			return "", fmt.Errorf("ANTHROPIC_API_KEY is not set")
		}
		apiEndpoint = "https://api.anthropic.com/v1/messages"
		fmt.Println("Using Anthropic API")

		anthropicReq := AnthropicRequest{
			Model:     "claude-3-5-sonnet-20240620",
			MaxTokens: 1024,
			Messages:  []Message{{Role: "user", Content: message}},
		}

		jsonData, err := json.Marshal(anthropicReq)
		if err != nil {
			return "", fmt.Errorf("error marshalling request: %v", err)
		}
		fmt.Printf("Request body: %s\n", string(jsonData))

		req, err := http.NewRequest("POST", apiEndpoint, bytes.NewBuffer(jsonData))
		if err != nil {
			return "", fmt.Errorf("error creating request: %v", err)
		}

		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-API-Key", apiKey)
		req.Header.Set("anthropic-version", "2023-06-01")

		client := &http.Client{}
		fmt.Println("Sending request to Anthropic API...")
		resp, err := client.Do(req)
		if err != nil {
			return "", fmt.Errorf("error sending request: %v", err)
		}
		defer resp.Body.Close()

		fmt.Printf("Response status: %s\n", resp.Status)

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return "", fmt.Errorf("error reading response body: %v", err)
		}
		fmt.Printf("Response body: %s\n", string(body))

		if resp.StatusCode != http.StatusOK {
			return "", fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
		}

		var anthropicResp AnthropicResponse
		err = json.Unmarshal(body, &anthropicResp)
		if err != nil {
			return "", fmt.Errorf("error unmarshalling response: %v", err)
		}

		if len(anthropicResp.Content) > 0 {
			responseText = anthropicResp.Content[0].Text
		} else {
			return "", fmt.Errorf("no content in response")
		}

	case "chatgpt":
		apiKey = os.Getenv("OPENAI_API_KEY")
		apiEndpoint = "https://api.openai.com/v1/chat/completions"

		openAIReq := OpenAIRequest{
			Model:    "gpt-3.5-turbo",
			Messages: []Message{{Role: "user", Content: message}},
		}

		jsonData, err := json.Marshal(openAIReq)
		if err != nil {
			return "", err
		}

		req, err := http.NewRequest("POST", apiEndpoint, bytes.NewBuffer(jsonData))
		if err != nil {
			return "", err
		}

		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+apiKey)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return "", err
		}
		defer resp.Body.Close()

		var openAIResp OpenAIResponse
		err = json.NewDecoder(resp.Body).Decode(&openAIResp)
		if err != nil {
			return "", err
		}

		if len(openAIResp.Choices) > 0 {
			responseText = openAIResp.Choices[0].Message.Content
		} else {
			return "", fmt.Errorf("no choices in response")
		}

	default:
		return "", fmt.Errorf("unsupported model: %s", model)
	}

	fmt.Printf("API Response: %s\n", responseText)
	return responseText, nil
}
