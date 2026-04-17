/**
 * Abstract contract for any AI text-generation provider.
 *
 * The service layer only depends on this interface — never on a specific SDK.
 * Swapping from OpenAI to Anthropic, Groq, or a local model is a matter of
 * registering a new adapter; no other file changes.
 */
export interface AIProvider {
  /**
   * Sends a system instruction and a user message to the underlying model.
   * Returns the raw text response.
   */
  generate(system: string, user: string): Promise<string>
}
