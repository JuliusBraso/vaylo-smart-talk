// Generated deterministically from the canonical local schema chain through migration 035.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      document_intelligence_jobs: {
        Row: {
          attempt_count: number
          created_at: string
          document_id: string
          finished_at: string | null
          id: string
          last_error: string | null
          last_error_at: string | null
          lease_expires_at: string | null
          lease_token: string | null
          result: Json | null
          scheduled_at: string
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          document_id: string
          finished_at?: string | null
          id?: string
          last_error?: string | null
          last_error_at?: string | null
          lease_expires_at?: string | null
          lease_token?: string | null
          result?: Json | null
          scheduled_at?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          document_id?: string
          finished_at?: string | null
          id?: string
          last_error?: string | null
          last_error_at?: string | null
          lease_expires_at?: string | null
          lease_token?: string | null
          result?: Json | null
          scheduled_at?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_intelligence_jobs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: true
            referencedRelation: "user_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_intelligence_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_type_step_links: {
        Row: {
          document_type_id: string
          link_type: string
          step_id: string
        }
        Insert: {
          document_type_id: string
          link_type: string
          step_id: string
        }
        Update: {
          document_type_id?: string
          link_type?: string
          step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_type_step_links_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "document_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_type_step_links_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "knowledge_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      document_types: {
        Row: {
          category: string | null
          created_at: string
          description_key: string | null
          id: string
          is_active: boolean
          slug: string
          title_key: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description_key?: string | null
          id: string
          is_active?: boolean
          slug: string
          title_key: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description_key?: string | null
          id?: string
          is_active?: boolean
          slug?: string
          title_key?: string
        }
        Relationships: []
      }
      i18n_jobs: {
        Row: {
          created_at: string
          id: string
          locale: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          locale: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          locale?: string
          status?: string
        }
        Relationships: []
      }
      i18n_translations: {
        Row: {
          created_at: string
          id: string
          key: string
          locale: string
          source: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          locale: string
          source?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          locale?: string
          source?: string
          value?: string
        }
        Relationships: []
      }
      knowledge_audit_events: {
        Row: {
          actor_type: string
          created_at: string
          entity_id: string
          entity_type: string
          event_type: string
          id: string
          new_state_hash: string
          occurred_at: string
          previous_state_hash: string | null
          reason: string | null
          review_record_id: string | null
          source_commit: string | null
          user_content_included: boolean
        }
        Insert: {
          actor_type: string
          created_at?: string
          entity_id: string
          entity_type: string
          event_type: string
          id?: string
          new_state_hash: string
          occurred_at?: string
          previous_state_hash?: string | null
          reason?: string | null
          review_record_id?: string | null
          source_commit?: string | null
          user_content_included?: boolean
        }
        Update: {
          actor_type?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          event_type?: string
          id?: string
          new_state_hash?: string
          occurred_at?: string
          previous_state_hash?: string | null
          reason?: string | null
          review_record_id?: string | null
          source_commit?: string | null
          user_content_included?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_audit_events_review_record_id_fkey"
            columns: ["review_record_id"]
            isOneToOne: false
            referencedRelation: "knowledge_review_records"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_authorities: {
        Row: {
          active_from: string | null
          active_until: string | null
          application_url: string | null
          authority_name: string
          authority_type: string
          contact_channels: string[] | null
          created_at: string
          id: string
          information_url: string | null
          jurisdiction_id: string
          official_portal_url: string | null
          publisher_id: string
          review_status: string
          status: string
          territorial_scope_id: string
        }
        Insert: {
          active_from?: string | null
          active_until?: string | null
          application_url?: string | null
          authority_name: string
          authority_type: string
          contact_channels?: string[] | null
          created_at?: string
          id?: string
          information_url?: string | null
          jurisdiction_id: string
          official_portal_url?: string | null
          publisher_id: string
          review_status?: string
          status?: string
          territorial_scope_id: string
        }
        Update: {
          active_from?: string | null
          active_until?: string | null
          application_url?: string | null
          authority_name?: string
          authority_type?: string
          contact_channels?: string[] | null
          created_at?: string
          id?: string
          information_url?: string | null
          jurisdiction_id?: string
          official_portal_url?: string | null
          publisher_id?: string
          review_status?: string
          status?: string
          territorial_scope_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_authorities_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_authorities_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "knowledge_publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_authorities_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_authority_competences: {
        Row: {
          authority_id: string
          competence_passage_id: string | null
          competence_source_version_id: string
          conflict_status: string
          created_at: string
          decides_application: boolean
          effective_from: string | null
          effective_until: string | null
          forwards_application: boolean
          handles_appeal: boolean
          handles_enforcement: boolean
          id: string
          institution_exchange_expected: boolean
          issues_document: boolean
          personal_scope: string | null
          procedural_stage: string | null
          provides_information_only: boolean
          receives_application: boolean
          requests_foreign_evidence: boolean
          review_status: string
          subject_matter: string
          territorial_scope_id: string
          verifies_evidence: boolean
        }
        Insert: {
          authority_id: string
          competence_passage_id?: string | null
          competence_source_version_id: string
          conflict_status?: string
          created_at?: string
          decides_application?: boolean
          effective_from?: string | null
          effective_until?: string | null
          forwards_application?: boolean
          handles_appeal?: boolean
          handles_enforcement?: boolean
          id?: string
          institution_exchange_expected?: boolean
          issues_document?: boolean
          personal_scope?: string | null
          procedural_stage?: string | null
          provides_information_only?: boolean
          receives_application?: boolean
          requests_foreign_evidence?: boolean
          review_status?: string
          subject_matter: string
          territorial_scope_id: string
          verifies_evidence?: boolean
        }
        Update: {
          authority_id?: string
          competence_passage_id?: string | null
          competence_source_version_id?: string
          conflict_status?: string
          created_at?: string
          decides_application?: boolean
          effective_from?: string | null
          effective_until?: string | null
          forwards_application?: boolean
          handles_appeal?: boolean
          handles_enforcement?: boolean
          id?: string
          institution_exchange_expected?: boolean
          issues_document?: boolean
          personal_scope?: string | null
          procedural_stage?: string | null
          provides_information_only?: boolean
          receives_application?: boolean
          requests_foreign_evidence?: boolean
          review_status?: string
          subject_matter?: string
          territorial_scope_id?: string
          verifies_evidence?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_authority_competenc_competence_source_version_id_fkey"
            columns: ["competence_source_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_authority_competences_authority_id_fkey"
            columns: ["authority_id"]
            isOneToOne: false
            referencedRelation: "knowledge_authorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_authority_competences_competence_passage_id_fkey"
            columns: ["competence_passage_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_authority_competences_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_canonical_unit_translations: {
        Row: {
          canonical_content_fingerprint: string
          created_at: string
          created_by_actor_type: string
          created_by_identifier: string | null
          effective_date_inherited: boolean
          entity_id: string
          entity_type: string
          field_key: string
          fingerprint_algorithm_version: string
          glossary_snapshot_reference: string | null
          human_reviewed: boolean
          id: string
          invalidated_at: string | null
          jurisdiction_inherited: boolean
          machine_generated: boolean
          machine_model: string | null
          machine_provider: string | null
          numeric_and_deadline_values_preserved: boolean
          output_locale: string
          provenance_note: string | null
          rejection_reason: string | null
          review_record_id: string | null
          reviewed_by_actor_type: string | null
          reviewed_by_identifier: string | null
          superseded_at: string | null
          translated_text: string
          translation_status: string
          translation_version: number
          uncertainty_preserved: boolean
          verified_at: string | null
          warnings_preserved: boolean
          withdrawn_at: string | null
        }
        Insert: {
          canonical_content_fingerprint: string
          created_at?: string
          created_by_actor_type: string
          created_by_identifier?: string | null
          effective_date_inherited?: boolean
          entity_id: string
          entity_type: string
          field_key: string
          fingerprint_algorithm_version?: string
          glossary_snapshot_reference?: string | null
          human_reviewed?: boolean
          id?: string
          invalidated_at?: string | null
          jurisdiction_inherited?: boolean
          machine_generated?: boolean
          machine_model?: string | null
          machine_provider?: string | null
          numeric_and_deadline_values_preserved?: boolean
          output_locale: string
          provenance_note?: string | null
          rejection_reason?: string | null
          review_record_id?: string | null
          reviewed_by_actor_type?: string | null
          reviewed_by_identifier?: string | null
          superseded_at?: string | null
          translated_text: string
          translation_status?: string
          translation_version?: number
          uncertainty_preserved?: boolean
          verified_at?: string | null
          warnings_preserved?: boolean
          withdrawn_at?: string | null
        }
        Update: {
          canonical_content_fingerprint?: string
          created_at?: string
          created_by_actor_type?: string
          created_by_identifier?: string | null
          effective_date_inherited?: boolean
          entity_id?: string
          entity_type?: string
          field_key?: string
          fingerprint_algorithm_version?: string
          glossary_snapshot_reference?: string | null
          human_reviewed?: boolean
          id?: string
          invalidated_at?: string | null
          jurisdiction_inherited?: boolean
          machine_generated?: boolean
          machine_model?: string | null
          machine_provider?: string | null
          numeric_and_deadline_values_preserved?: boolean
          output_locale?: string
          provenance_note?: string | null
          rejection_reason?: string | null
          review_record_id?: string | null
          reviewed_by_actor_type?: string | null
          reviewed_by_identifier?: string | null
          superseded_at?: string | null
          translated_text?: string
          translation_status?: string
          translation_version?: number
          uncertainty_preserved?: boolean
          verified_at?: string | null
          warnings_preserved?: boolean
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_canonical_unit_translations_review_record_id_fkey"
            columns: ["review_record_id"]
            isOneToOne: false
            referencedRelation: "knowledge_review_records"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_citations: {
        Row: {
          canonical_url: string | null
          claim_id: string
          created_at: string
          effective_from: string | null
          effective_until: string | null
          id: string
          internal_audit_label: string
          jurisdiction_id: string
          last_verified_at: string | null
          original_language: string
          passage_id: string
          publisher_id: string
          source_id: string
          source_version_id: string
          user_facing_label: string
        }
        Insert: {
          canonical_url?: string | null
          claim_id: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          internal_audit_label: string
          jurisdiction_id: string
          last_verified_at?: string | null
          original_language: string
          passage_id: string
          publisher_id: string
          source_id: string
          source_version_id: string
          user_facing_label: string
        }
        Update: {
          canonical_url?: string | null
          claim_id?: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          internal_audit_label?: string
          jurisdiction_id?: string
          last_verified_at?: string | null
          original_language?: string
          passage_id?: string
          publisher_id?: string
          source_id?: string
          source_version_id?: string
          user_facing_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_citations_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "knowledge_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_citations_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_citations_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_citations_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "knowledge_publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_citations_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_citations_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_claim_evidence_links: {
        Row: {
          authority_competence_match: boolean
          authorized_use: string[]
          claim_id: string
          conflict_status: string
          created_at: string
          effective_date_match: boolean
          evidence_role: string
          id: string
          is_primary_evidence: boolean
          jurisdiction_match: boolean
          passage_id: string
          qualification_required: boolean
          review_accepted: boolean
          source_version_id: string
          support_status: string
          territorial_scope_match: boolean
        }
        Insert: {
          authority_competence_match?: boolean
          authorized_use?: string[]
          claim_id: string
          conflict_status?: string
          created_at?: string
          effective_date_match?: boolean
          evidence_role: string
          id?: string
          is_primary_evidence?: boolean
          jurisdiction_match?: boolean
          passage_id: string
          qualification_required?: boolean
          review_accepted?: boolean
          source_version_id: string
          support_status: string
          territorial_scope_match?: boolean
        }
        Update: {
          authority_competence_match?: boolean
          authorized_use?: string[]
          claim_id?: string
          conflict_status?: string
          created_at?: string
          effective_date_match?: boolean
          evidence_role?: string
          id?: string
          is_primary_evidence?: boolean
          jurisdiction_match?: boolean
          passage_id?: string
          qualification_required?: boolean
          review_accepted?: boolean
          source_version_id?: string
          support_status?: string
          territorial_scope_match?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_claim_evidence_links_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "knowledge_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_claim_evidence_links_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_claim_evidence_links_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_claims: {
        Row: {
          allowed_output_uses: string[]
          authority_id: string | null
          blocked_output_uses: string[]
          claim_language: string
          claim_text_canonical: string
          claim_type: string
          created_at: string
          effective_from: string | null
          effective_until: string | null
          freshness_status: string
          id: string
          jurisdiction_id: string
          market: string
          requires_authority_resolution: boolean
          requires_citation: boolean
          requires_conflict_clearance: boolean
          requires_direct_support: boolean
          requires_effective_date: boolean
          review_status: string
          risk_level: string
          status: string
          territorial_scope_id: string | null
        }
        Insert: {
          allowed_output_uses?: string[]
          authority_id?: string | null
          blocked_output_uses?: string[]
          claim_language?: string
          claim_text_canonical: string
          claim_type: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          freshness_status?: string
          id?: string
          jurisdiction_id: string
          market?: string
          requires_authority_resolution?: boolean
          requires_citation?: boolean
          requires_conflict_clearance?: boolean
          requires_direct_support?: boolean
          requires_effective_date?: boolean
          review_status?: string
          risk_level: string
          status?: string
          territorial_scope_id?: string | null
        }
        Update: {
          allowed_output_uses?: string[]
          authority_id?: string | null
          blocked_output_uses?: string[]
          claim_language?: string
          claim_text_canonical?: string
          claim_type?: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          freshness_status?: string
          id?: string
          jurisdiction_id?: string
          market?: string
          requires_authority_resolution?: boolean
          requires_citation?: boolean
          requires_conflict_clearance?: boolean
          requires_direct_support?: boolean
          requires_effective_date?: boolean
          review_status?: string
          risk_level?: string
          status?: string
          territorial_scope_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_claims_authority_id_fkey"
            columns: ["authority_id"]
            isOneToOne: false
            referencedRelation: "knowledge_authorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_claims_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_claims_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_conflicts: {
        Row: {
          authority_ids: string[] | null
          blocks_high_risk_use: boolean
          conflict_type: string
          created_at: string
          detected_at: string
          entity_ids: string[]
          id: string
          jurisdiction_ids: string[] | null
          passage_ids: string[] | null
          resolution: string | null
          resolved_at: string | null
          review_record_id: string | null
          severity: string
          source_version_ids: string[] | null
          status: string
        }
        Insert: {
          authority_ids?: string[] | null
          blocks_high_risk_use?: boolean
          conflict_type: string
          created_at?: string
          detected_at?: string
          entity_ids?: string[]
          id?: string
          jurisdiction_ids?: string[] | null
          passage_ids?: string[] | null
          resolution?: string | null
          resolved_at?: string | null
          review_record_id?: string | null
          severity?: string
          source_version_ids?: string[] | null
          status?: string
        }
        Update: {
          authority_ids?: string[] | null
          blocks_high_risk_use?: boolean
          conflict_type?: string
          created_at?: string
          detected_at?: string
          entity_ids?: string[]
          id?: string
          jurisdiction_ids?: string[] | null
          passage_ids?: string[] | null
          resolution?: string | null
          resolved_at?: string | null
          review_record_id?: string | null
          severity?: string
          source_version_ids?: string[] | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_conflicts_review_record_id_fkey"
            columns: ["review_record_id"]
            isOneToOne: false
            referencedRelation: "knowledge_review_records"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_cross_border_connectors: {
        Row: {
          activation_from_locale_allowed: boolean
          activation_requires_verified_case_context: boolean
          connected_country: string
          created_at: string
          effective_from: string | null
          effective_until: string | null
          id: string
          origin_market: string
          review_status: string
          status: string
          trust_domain_ids: string[]
        }
        Insert: {
          activation_from_locale_allowed?: boolean
          activation_requires_verified_case_context?: boolean
          connected_country: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          origin_market?: string
          review_status?: string
          status?: string
          trust_domain_ids?: string[]
        }
        Update: {
          activation_from_locale_allowed?: boolean
          activation_requires_verified_case_context?: boolean
          connected_country?: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          origin_market?: string
          review_status?: string
          status?: string
          trust_domain_ids?: string[]
        }
        Relationships: []
      }
      knowledge_cross_border_processes: {
        Row: {
          allowed_output_uses: string[]
          authority_resolution_status: string
          blocked_output_uses: string[]
          conflict_status: string
          created_at: string
          cross_border_connector_id: string
          eu_coordination_claim_ids: string[]
          evidence_completeness_status: string
          foreign_claim_ids: string[]
          foreign_process_reference: string | null
          german_claim_ids: string[]
          german_process_id: string
          id: string
          responsible_actor_rule_id: string
          review_status: string
          temporal_alignment_status: string
        }
        Insert: {
          allowed_output_uses?: string[]
          authority_resolution_status?: string
          blocked_output_uses?: string[]
          conflict_status?: string
          created_at?: string
          cross_border_connector_id: string
          eu_coordination_claim_ids?: string[]
          evidence_completeness_status?: string
          foreign_claim_ids?: string[]
          foreign_process_reference?: string | null
          german_claim_ids?: string[]
          german_process_id: string
          id?: string
          responsible_actor_rule_id: string
          review_status?: string
          temporal_alignment_status?: string
        }
        Update: {
          allowed_output_uses?: string[]
          authority_resolution_status?: string
          blocked_output_uses?: string[]
          conflict_status?: string
          created_at?: string
          cross_border_connector_id?: string
          eu_coordination_claim_ids?: string[]
          evidence_completeness_status?: string
          foreign_claim_ids?: string[]
          foreign_process_reference?: string | null
          german_claim_ids?: string[]
          german_process_id?: string
          id?: string
          responsible_actor_rule_id?: string
          review_status?: string
          temporal_alignment_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_cross_border_processes_cross_border_connector_id_fkey"
            columns: ["cross_border_connector_id"]
            isOneToOne: false
            referencedRelation: "knowledge_cross_border_connectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_cross_border_processes_german_process_id_fkey"
            columns: ["german_process_id"]
            isOneToOne: false
            referencedRelation: "knowledge_processes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_cross_border_processes_responsible_actor_rule_id_fkey"
            columns: ["responsible_actor_rule_id"]
            isOneToOne: false
            referencedRelation: "knowledge_responsible_actor_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_deadline_rules: {
        Row: {
          authority_id: string | null
          business_day_rule: string | null
          calendar_rule: string | null
          conflict_status: string
          created_at: string
          deadline_type: string
          duration_unit: string | null
          duration_value: number | null
          effective_from: string | null
          effective_until: string | null
          exact_calculation_allowed: boolean
          id: string
          jurisdiction_id: string
          passage_id: string
          required_date_precision: string
          review_status: string
          risk_level: string
          service_rule: string | null
          source_version_id: string
          territorial_scope_id: string | null
          timezone_rule: string | null
          trigger_date_source: string
          trigger_event_type: string
        }
        Insert: {
          authority_id?: string | null
          business_day_rule?: string | null
          calendar_rule?: string | null
          conflict_status?: string
          created_at?: string
          deadline_type: string
          duration_unit?: string | null
          duration_value?: number | null
          effective_from?: string | null
          effective_until?: string | null
          exact_calculation_allowed?: boolean
          id?: string
          jurisdiction_id: string
          passage_id: string
          required_date_precision?: string
          review_status?: string
          risk_level: string
          service_rule?: string | null
          source_version_id: string
          territorial_scope_id?: string | null
          timezone_rule?: string | null
          trigger_date_source: string
          trigger_event_type: string
        }
        Update: {
          authority_id?: string | null
          business_day_rule?: string | null
          calendar_rule?: string | null
          conflict_status?: string
          created_at?: string
          deadline_type?: string
          duration_unit?: string | null
          duration_value?: number | null
          effective_from?: string | null
          effective_until?: string | null
          exact_calculation_allowed?: boolean
          id?: string
          jurisdiction_id?: string
          passage_id?: string
          required_date_precision?: string
          review_status?: string
          risk_level?: string
          service_rule?: string | null
          source_version_id?: string
          territorial_scope_id?: string | null
          timezone_rule?: string | null
          trigger_date_source?: string
          trigger_event_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_deadline_rules_authority_id_fkey"
            columns: ["authority_id"]
            isOneToOne: false
            referencedRelation: "knowledge_authorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_deadline_rules_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_deadline_rules_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_deadline_rules_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_deadline_rules_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_eligibility_rules: {
        Row: {
          condition_expression: string | null
          conflict_status: string
          created_at: string
          effective_from: string | null
          effective_until: string | null
          final_determination_allowed: boolean
          id: string
          jurisdiction_id: string
          passage_id: string
          process_id: string
          required_facts: string[]
          review_status: string
          risk_level: string
          source_version_id: string
          territorial_scope_id: string | null
        }
        Insert: {
          condition_expression?: string | null
          conflict_status?: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          final_determination_allowed?: boolean
          id?: string
          jurisdiction_id: string
          passage_id: string
          process_id: string
          required_facts?: string[]
          review_status?: string
          risk_level: string
          source_version_id: string
          territorial_scope_id?: string | null
        }
        Update: {
          condition_expression?: string | null
          conflict_status?: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          final_determination_allowed?: boolean
          id?: string
          jurisdiction_id?: string
          passage_id?: string
          process_id?: string
          required_facts?: string[]
          review_status?: string
          risk_level?: string
          source_version_id?: string
          territorial_scope_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_eligibility_rules_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_eligibility_rules_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_eligibility_rules_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "knowledge_processes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_eligibility_rules_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_eligibility_rules_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_evidence_requirements: {
        Row: {
          authority_requests_directly: boolean
          category: string
          created_at: string
          description_canonical: string | null
          effective_from: string | null
          effective_until: string | null
          id: string
          institution_exchange_expected: boolean
          jurisdiction_id: string | null
          name: string
          passage_id: string | null
          required_by_process_id: string | null
          required_by_step_id: string | null
          responsible_actor_rule_id: string
          review_status: string
          source_version_id: string | null
          territorial_scope_id: string | null
          user_submission_expected: boolean
        }
        Insert: {
          authority_requests_directly?: boolean
          category: string
          created_at?: string
          description_canonical?: string | null
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          institution_exchange_expected?: boolean
          jurisdiction_id?: string | null
          name: string
          passage_id?: string | null
          required_by_process_id?: string | null
          required_by_step_id?: string | null
          responsible_actor_rule_id: string
          review_status?: string
          source_version_id?: string | null
          territorial_scope_id?: string | null
          user_submission_expected?: boolean
        }
        Update: {
          authority_requests_directly?: boolean
          category?: string
          created_at?: string
          description_canonical?: string | null
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          institution_exchange_expected?: boolean
          jurisdiction_id?: string | null
          name?: string
          passage_id?: string | null
          required_by_process_id?: string | null
          required_by_step_id?: string | null
          responsible_actor_rule_id?: string
          review_status?: string
          source_version_id?: string | null
          territorial_scope_id?: string | null
          user_submission_expected?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_evidence_requirements_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_evidence_requirements_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_evidence_requirements_required_by_process_id_fkey"
            columns: ["required_by_process_id"]
            isOneToOne: false
            referencedRelation: "knowledge_processes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_evidence_requirements_required_by_step_id_fkey"
            columns: ["required_by_step_id"]
            isOneToOne: false
            referencedRelation: "knowledge_process_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_evidence_requirements_responsible_actor_rule_id_fkey"
            columns: ["responsible_actor_rule_id"]
            isOneToOne: false
            referencedRelation: "knowledge_responsible_actor_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_evidence_requirements_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_evidence_requirements_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_fee_rules: {
        Row: {
          amount: number | null
          amount_type: string | null
          authority_id: string | null
          condition: string | null
          conflict_status: string
          created_at: string
          currency: string | null
          effective_from: string | null
          effective_until: string | null
          fee_status: string
          id: string
          jurisdiction_id: string
          maximum_amount: number | null
          minimum_amount: number | null
          passage_id: string
          review_status: string
          source_version_id: string
          territorial_scope_id: string | null
        }
        Insert: {
          amount?: number | null
          amount_type?: string | null
          authority_id?: string | null
          condition?: string | null
          conflict_status?: string
          created_at?: string
          currency?: string | null
          effective_from?: string | null
          effective_until?: string | null
          fee_status: string
          id?: string
          jurisdiction_id: string
          maximum_amount?: number | null
          minimum_amount?: number | null
          passage_id: string
          review_status?: string
          source_version_id: string
          territorial_scope_id?: string | null
        }
        Update: {
          amount?: number | null
          amount_type?: string | null
          authority_id?: string | null
          condition?: string | null
          conflict_status?: string
          created_at?: string
          currency?: string | null
          effective_from?: string | null
          effective_until?: string | null
          fee_status?: string
          id?: string
          jurisdiction_id?: string
          maximum_amount?: number | null
          minimum_amount?: number | null
          passage_id?: string
          review_status?: string
          source_version_id?: string
          territorial_scope_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_fee_rules_authority_id_fkey"
            columns: ["authority_id"]
            isOneToOne: false
            referencedRelation: "knowledge_authorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_fee_rules_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_fee_rules_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_fee_rules_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_fee_rules_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_form_requirements: {
        Row: {
          condition: string | null
          created_at: string
          effective_from: string | null
          effective_until: string | null
          evidence_requirement_id: string | null
          field_name: string
          field_type: string
          form_id: string
          id: string
          required_status: string
          review_status: string
          source_passage_id: string
        }
        Insert: {
          condition?: string | null
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          evidence_requirement_id?: string | null
          field_name: string
          field_type: string
          form_id: string
          id?: string
          required_status?: string
          review_status?: string
          source_passage_id: string
        }
        Update: {
          condition?: string | null
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          evidence_requirement_id?: string | null
          field_name?: string
          field_type?: string
          form_id?: string
          id?: string
          required_status?: string
          review_status?: string
          source_passage_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_form_requirements_evidence_requirement_id_fkey"
            columns: ["evidence_requirement_id"]
            isOneToOne: false
            referencedRelation: "knowledge_evidence_requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_form_requirements_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "knowledge_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_form_requirements_source_passage_id_fkey"
            columns: ["source_passage_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_passages"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_forms: {
        Row: {
          authority_id: string
          created_at: string
          effective_from: string | null
          effective_until: string | null
          form_identifier: string | null
          form_name: string
          id: string
          instructions_passage_id: string | null
          jurisdiction_id: string
          purpose: string
          review_status: string
          source_version_id: string
          status: string
          submission_channels: string[]
          territorial_scope_id: string | null
        }
        Insert: {
          authority_id: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          form_identifier?: string | null
          form_name: string
          id?: string
          instructions_passage_id?: string | null
          jurisdiction_id: string
          purpose: string
          review_status?: string
          source_version_id: string
          status?: string
          submission_channels?: string[]
          territorial_scope_id?: string | null
        }
        Update: {
          authority_id?: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          form_identifier?: string | null
          form_name?: string
          id?: string
          instructions_passage_id?: string | null
          jurisdiction_id?: string
          purpose?: string
          review_status?: string
          source_version_id?: string
          status?: string
          submission_channels?: string[]
          territorial_scope_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_forms_authority_id_fkey"
            columns: ["authority_id"]
            isOneToOne: false
            referencedRelation: "knowledge_authorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_forms_instructions_passage_id_fkey"
            columns: ["instructions_passage_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_forms_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_forms_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_forms_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_freshness_records: {
        Row: {
          change_status: string
          checked_at: string
          content_hash_matches: boolean
          created_at: string
          effective_date_known: boolean
          entity_id: string
          entity_type: string
          freshness_status: string
          id: string
          next_check_due_at: string | null
          notes: string | null
          review_required: boolean
          source_available: boolean
        }
        Insert: {
          change_status?: string
          checked_at?: string
          content_hash_matches?: boolean
          created_at?: string
          effective_date_known?: boolean
          entity_id: string
          entity_type: string
          freshness_status: string
          id?: string
          next_check_due_at?: string | null
          notes?: string | null
          review_required?: boolean
          source_available?: boolean
        }
        Update: {
          change_status?: string
          checked_at?: string
          content_hash_matches?: boolean
          created_at?: string
          effective_date_known?: boolean
          entity_id?: string
          entity_type?: string
          freshness_status?: string
          id?: string
          next_check_due_at?: string | null
          notes?: string | null
          review_required?: boolean
          source_available?: boolean
        }
        Relationships: []
      }
      knowledge_jurisdictions: {
        Row: {
          country_code: string | null
          created_at: string
          id: string
          jurisdiction_code: string | null
          jurisdiction_level: string
          name: string
          parent_jurisdiction_id: string | null
          status: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          id?: string
          jurisdiction_code?: string | null
          jurisdiction_level: string
          name: string
          parent_jurisdiction_id?: string | null
          status?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string
          id?: string
          jurisdiction_code?: string | null
          jurisdiction_level?: string
          name?: string
          parent_jurisdiction_id?: string | null
          status?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_jurisdictions_parent_jurisdiction_id_fkey"
            columns: ["parent_jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_localized_terminology: {
        Row: {
          blocked_actions_equivalent: boolean
          created_at: string
          id: string
          localized_explanation: string
          localized_term: string
          official_german_term_retained: boolean
          output_locale: string
          review_status: string
          reviewed_by: string | null
          terminology_entry_id: string
          translation_status: string
          uncertainty_equivalent: boolean
          urgency_equivalent: boolean
          warnings_equivalent: boolean
        }
        Insert: {
          blocked_actions_equivalent?: boolean
          created_at?: string
          id?: string
          localized_explanation: string
          localized_term: string
          official_german_term_retained?: boolean
          output_locale: string
          review_status?: string
          reviewed_by?: string | null
          terminology_entry_id: string
          translation_status?: string
          uncertainty_equivalent?: boolean
          urgency_equivalent?: boolean
          warnings_equivalent?: boolean
        }
        Update: {
          blocked_actions_equivalent?: boolean
          created_at?: string
          id?: string
          localized_explanation?: string
          localized_term?: string
          official_german_term_retained?: boolean
          output_locale?: string
          review_status?: string
          reviewed_by?: string | null
          terminology_entry_id?: string
          translation_status?: string
          uncertainty_equivalent?: boolean
          urgency_equivalent?: boolean
          warnings_equivalent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_localized_terminology_terminology_entry_id_fkey"
            columns: ["terminology_entry_id"]
            isOneToOne: false
            referencedRelation: "knowledge_terminology"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_process_claim_links: {
        Row: {
          claim_id: string
          claim_role: string
          created_at: string
          id: string
          process_id: string
          process_step_id: string | null
          qualification_required: boolean
          required: boolean
          sequence_context: string | null
        }
        Insert: {
          claim_id: string
          claim_role: string
          created_at?: string
          id?: string
          process_id: string
          process_step_id?: string | null
          qualification_required?: boolean
          required?: boolean
          sequence_context?: string | null
        }
        Update: {
          claim_id?: string
          claim_role?: string
          created_at?: string
          id?: string
          process_id?: string
          process_step_id?: string | null
          qualification_required?: boolean
          required?: boolean
          sequence_context?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_process_claim_links_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "knowledge_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_process_claim_links_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "knowledge_processes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_process_claim_links_process_step_id_fkey"
            columns: ["process_step_id"]
            isOneToOne: false
            referencedRelation: "knowledge_process_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_process_steps: {
        Row: {
          allowed_output_uses: string[]
          authority_id: string | null
          blocked_output_uses: string[]
          created_at: string
          deadline_rule_id: string | null
          description_canonical: string | null
          effective_from: string | null
          effective_until: string | null
          entry_conditions: string[] | null
          exit_conditions: string[] | null
          fee_rule_id: string | null
          form_id: string | null
          id: string
          optional: boolean
          process_id: string
          regional_variation_expected: boolean
          required_evidence_ids: string[]
          responsible_actor_rule_id: string
          review_status: string
          step_order: number
          step_type: string
          title: string
        }
        Insert: {
          allowed_output_uses?: string[]
          authority_id?: string | null
          blocked_output_uses?: string[]
          created_at?: string
          deadline_rule_id?: string | null
          description_canonical?: string | null
          effective_from?: string | null
          effective_until?: string | null
          entry_conditions?: string[] | null
          exit_conditions?: string[] | null
          fee_rule_id?: string | null
          form_id?: string | null
          id?: string
          optional?: boolean
          process_id: string
          regional_variation_expected?: boolean
          required_evidence_ids?: string[]
          responsible_actor_rule_id: string
          review_status?: string
          step_order: number
          step_type: string
          title: string
        }
        Update: {
          allowed_output_uses?: string[]
          authority_id?: string | null
          blocked_output_uses?: string[]
          created_at?: string
          deadline_rule_id?: string | null
          description_canonical?: string | null
          effective_from?: string | null
          effective_until?: string | null
          entry_conditions?: string[] | null
          exit_conditions?: string[] | null
          fee_rule_id?: string | null
          form_id?: string | null
          id?: string
          optional?: boolean
          process_id?: string
          regional_variation_expected?: boolean
          required_evidence_ids?: string[]
          responsible_actor_rule_id?: string
          review_status?: string
          step_order?: number
          step_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_process_steps_authority_id_fkey"
            columns: ["authority_id"]
            isOneToOne: false
            referencedRelation: "knowledge_authorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_process_steps_deadline_rule_id_fkey"
            columns: ["deadline_rule_id"]
            isOneToOne: false
            referencedRelation: "knowledge_deadline_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_process_steps_fee_rule_id_fkey"
            columns: ["fee_rule_id"]
            isOneToOne: false
            referencedRelation: "knowledge_fee_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_process_steps_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "knowledge_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_process_steps_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "knowledge_processes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_process_steps_responsible_actor_rule_id_fkey"
            columns: ["responsible_actor_rule_id"]
            isOneToOne: false
            referencedRelation: "knowledge_responsible_actor_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_processes: {
        Row: {
          created_at: string
          cross_border_preparation_relevant: boolean
          effective_from: string | null
          effective_until: string | null
          expected_outcomes: string[] | null
          full_legal_advice_excluded: boolean
          id: string
          jurisdiction_id: string
          market: string
          orientation_only: boolean
          process_group_id: string
          regional_variation_expected: boolean
          review_status: string
          risk_level: string
          safe_first_step: string | null
          status: string
          territorial_scope_id: string | null
          title: string
          trigger_description: string | null
        }
        Insert: {
          created_at?: string
          cross_border_preparation_relevant?: boolean
          effective_from?: string | null
          effective_until?: string | null
          expected_outcomes?: string[] | null
          full_legal_advice_excluded?: boolean
          id?: string
          jurisdiction_id: string
          market?: string
          orientation_only?: boolean
          process_group_id: string
          regional_variation_expected?: boolean
          review_status?: string
          risk_level: string
          safe_first_step?: string | null
          status?: string
          territorial_scope_id?: string | null
          title: string
          trigger_description?: string | null
        }
        Update: {
          created_at?: string
          cross_border_preparation_relevant?: boolean
          effective_from?: string | null
          effective_until?: string | null
          expected_outcomes?: string[] | null
          full_legal_advice_excluded?: boolean
          id?: string
          jurisdiction_id?: string
          market?: string
          orientation_only?: boolean
          process_group_id?: string
          regional_variation_expected?: boolean
          review_status?: string
          risk_level?: string
          safe_first_step?: string | null
          status?: string
          territorial_scope_id?: string | null
          title?: string
          trigger_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_processes_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_processes_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_publication_state_transitions: {
        Row: {
          actor_class: string
          actor_identifier: string | null
          created_at: string
          emergency_flag: boolean
          entity_id: string
          entity_type: string
          expected_state_version: number
          from_state: string | null
          from_state_version: number
          id: string
          idempotency_key: string
          provenance_note: string | null
          replacement_entity_id: string | null
          replacement_entity_type: string | null
          resulting_state_version: number
          review_record_id: string | null
          to_state: string
          transition_reason: string | null
          transition_reason_code: string
          transitioned_at: string
        }
        Insert: {
          actor_class: string
          actor_identifier?: string | null
          created_at?: string
          emergency_flag?: boolean
          entity_id: string
          entity_type: string
          expected_state_version: number
          from_state?: string | null
          from_state_version: number
          id?: string
          idempotency_key: string
          provenance_note?: string | null
          replacement_entity_id?: string | null
          replacement_entity_type?: string | null
          resulting_state_version: number
          review_record_id?: string | null
          to_state: string
          transition_reason?: string | null
          transition_reason_code: string
          transitioned_at?: string
        }
        Update: {
          actor_class?: string
          actor_identifier?: string | null
          created_at?: string
          emergency_flag?: boolean
          entity_id?: string
          entity_type?: string
          expected_state_version?: number
          from_state?: string | null
          from_state_version?: number
          id?: string
          idempotency_key?: string
          provenance_note?: string | null
          replacement_entity_id?: string | null
          replacement_entity_type?: string | null
          resulting_state_version?: number
          review_record_id?: string | null
          to_state?: string
          transition_reason?: string | null
          transition_reason_code?: string
          transitioned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_publication_state_transitions_review_record_id_fkey"
            columns: ["review_record_id"]
            isOneToOne: false
            referencedRelation: "knowledge_review_records"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_publication_states: {
        Row: {
          created_at: string
          current_state: string
          current_transition_id: string
          effective_from: string | null
          effective_until: string | null
          emergency_disabled: boolean
          entity_id: string
          entity_type: string
          id: string
          jurisdiction_id: string | null
          reason_code: string | null
          state_version: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_state?: string
          current_transition_id: string
          effective_from?: string | null
          effective_until?: string | null
          emergency_disabled?: boolean
          entity_id: string
          entity_type: string
          id?: string
          jurisdiction_id?: string | null
          reason_code?: string | null
          state_version?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_state?: string
          current_transition_id?: string
          effective_from?: string | null
          effective_until?: string | null
          emergency_disabled?: boolean
          entity_id?: string
          entity_type?: string
          id?: string
          jurisdiction_id?: string | null
          reason_code?: string | null
          state_version?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_publication_states_current_transition_id_fkey"
            columns: ["current_transition_id"]
            isOneToOne: false
            referencedRelation: "knowledge_publication_state_transitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_publication_states_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_publishers: {
        Row: {
          active_from: string | null
          active_until: string | null
          created_at: string
          id: string
          official_domain_ids: string[] | null
          official_status: boolean
          procedural_competence: string[] | null
          publisher_name: string
          publisher_type: string
          review_status: string
          subject_matter_competence: string[]
          territorial_competence_id: string | null
          trust_domain_id: string
        }
        Insert: {
          active_from?: string | null
          active_until?: string | null
          created_at?: string
          id?: string
          official_domain_ids?: string[] | null
          official_status?: boolean
          procedural_competence?: string[] | null
          publisher_name: string
          publisher_type: string
          review_status?: string
          subject_matter_competence?: string[]
          territorial_competence_id?: string | null
          trust_domain_id: string
        }
        Update: {
          active_from?: string | null
          active_until?: string | null
          created_at?: string
          id?: string
          official_domain_ids?: string[] | null
          official_status?: boolean
          procedural_competence?: string[] | null
          publisher_name?: string
          publisher_type?: string
          review_status?: string
          subject_matter_competence?: string[]
          territorial_competence_id?: string | null
          trust_domain_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_publishers_territorial_competence_id_fkey"
            columns: ["territorial_competence_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_publishers_trust_domain_id_fkey"
            columns: ["trust_domain_id"]
            isOneToOne: false
            referencedRelation: "knowledge_trust_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_regional_overrides: {
        Row: {
          authority_id: string | null
          base_rule_entity_id: string
          base_rule_entity_type: string
          conflict_status: string
          created_at: string
          effective_from: string | null
          effective_until: string | null
          id: string
          override_rule_entity_id: string
          override_rule_entity_type: string
          override_type: string
          passage_id: string | null
          priority_context: string | null
          review_status: string
          source_version_id: string
          substantive_law_changed: boolean
          territorial_scope_id: string
        }
        Insert: {
          authority_id?: string | null
          base_rule_entity_id: string
          base_rule_entity_type: string
          conflict_status?: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          override_rule_entity_id: string
          override_rule_entity_type: string
          override_type: string
          passage_id?: string | null
          priority_context?: string | null
          review_status?: string
          source_version_id: string
          substantive_law_changed?: boolean
          territorial_scope_id: string
        }
        Update: {
          authority_id?: string | null
          base_rule_entity_id?: string
          base_rule_entity_type?: string
          conflict_status?: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          override_rule_entity_id?: string
          override_rule_entity_type?: string
          override_type?: string
          passage_id?: string | null
          priority_context?: string | null
          review_status?: string
          source_version_id?: string
          substantive_law_changed?: boolean
          territorial_scope_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_regional_overrides_authority_id_fkey"
            columns: ["authority_id"]
            isOneToOne: false
            referencedRelation: "knowledge_authorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_regional_overrides_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_regional_overrides_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_regional_overrides_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_responsible_actor_rules: {
        Row: {
          actor_state: string
          concrete_instruction_allowed: boolean
          conflict_status: string
          created_at: string
          effective_from: string | null
          effective_until: string | null
          foreign_authority_must_act: boolean
          german_authority_must_act: boolean
          id: string
          institution_exchange_expected: boolean
          jurisdiction_id: string | null
          professional_confirmation_required: boolean
          review_status: string
          supporting_claim_ids: string[]
          supporting_passage_ids: string[]
          territorial_scope_id: string | null
          user_must_act: boolean
        }
        Insert: {
          actor_state: string
          concrete_instruction_allowed?: boolean
          conflict_status?: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          foreign_authority_must_act?: boolean
          german_authority_must_act?: boolean
          id?: string
          institution_exchange_expected?: boolean
          jurisdiction_id?: string | null
          professional_confirmation_required?: boolean
          review_status?: string
          supporting_claim_ids?: string[]
          supporting_passage_ids?: string[]
          territorial_scope_id?: string | null
          user_must_act?: boolean
        }
        Update: {
          actor_state?: string
          concrete_instruction_allowed?: boolean
          conflict_status?: string
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          foreign_authority_must_act?: boolean
          german_authority_must_act?: boolean
          id?: string
          institution_exchange_expected?: boolean
          jurisdiction_id?: string | null
          professional_confirmation_required?: boolean
          review_status?: string
          supporting_claim_ids?: string[]
          supporting_passage_ids?: string[]
          territorial_scope_id?: string | null
          user_must_act?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_responsible_actor_rules_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_responsible_actor_rules_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_retrieval_metadata: {
        Row: {
          authoritative_by_vector_similarity: boolean
          created_at: string
          effective_date_filter_required: boolean
          embedding_model: string | null
          embedding_version: string | null
          entity_id: string
          entity_type: string
          full_text_indexed: boolean
          handling_policy_filter_required: boolean
          id: string
          indexed_at: string | null
          jurisdiction_filter_required: boolean
          review_status_filter_required: boolean
          source_authorization_filter_required: boolean
          stale_policy_filter_required: boolean
          trust_domain_filter_required: boolean
          vector_indexed: boolean
        }
        Insert: {
          authoritative_by_vector_similarity?: boolean
          created_at?: string
          effective_date_filter_required?: boolean
          embedding_model?: string | null
          embedding_version?: string | null
          entity_id: string
          entity_type: string
          full_text_indexed?: boolean
          handling_policy_filter_required?: boolean
          id?: string
          indexed_at?: string | null
          jurisdiction_filter_required?: boolean
          review_status_filter_required?: boolean
          source_authorization_filter_required?: boolean
          stale_policy_filter_required?: boolean
          trust_domain_filter_required?: boolean
          vector_indexed?: boolean
        }
        Update: {
          authoritative_by_vector_similarity?: boolean
          created_at?: string
          effective_date_filter_required?: boolean
          embedding_model?: string | null
          embedding_version?: string | null
          entity_id?: string
          entity_type?: string
          full_text_indexed?: boolean
          handling_policy_filter_required?: boolean
          id?: string
          indexed_at?: string | null
          jurisdiction_filter_required?: boolean
          review_status_filter_required?: boolean
          source_authorization_filter_required?: boolean
          stale_policy_filter_required?: boolean
          trust_domain_filter_required?: boolean
          vector_indexed?: boolean
        }
        Relationships: []
      }
      knowledge_review_records: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          high_risk_use_approved: boolean
          id: string
          notes: string | null
          reason: string | null
          review_due_at: string | null
          review_level: string
          review_status: string
          reviewed_at: string
          reviewer_type: string
          source_change_detected: boolean
          supersedes_review_record_id: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          high_risk_use_approved?: boolean
          id?: string
          notes?: string | null
          reason?: string | null
          review_due_at?: string | null
          review_level: string
          review_status: string
          reviewed_at?: string
          reviewer_type: string
          source_change_detected?: boolean
          supersedes_review_record_id?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          high_risk_use_approved?: boolean
          id?: string
          notes?: string | null
          reason?: string | null
          review_due_at?: string | null
          review_level?: string
          review_status?: string
          reviewed_at?: string
          reviewer_type?: string
          source_change_detected?: boolean
          supersedes_review_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_review_records_supersedes_review_record_id_fkey"
            columns: ["supersedes_review_record_id"]
            isOneToOne: false
            referencedRelation: "knowledge_review_records"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_source_acquisition_attempts: {
        Row: {
          actor_audit_identifier: string
          attempted_at: string
          content_hash: string | null
          content_length: number | null
          content_type: string | null
          created_at: string
          etag: string | null
          failure_code: string | null
          http_status: number | null
          id: string
          idempotency_key: string
          last_modified: string | null
          normalized_content_hash: string | null
          operation_actor_class: string
          parser_version: string | null
          raw_content_retention_policy: string
          retrieval_method: Database["public"]["Enums"]["knowledge_retrieval_method"]
          retrieval_result: Database["public"]["Enums"]["knowledge_acquisition_result"]
          retryable: boolean
          source_id: string
        }
        Insert: {
          actor_audit_identifier: string
          attempted_at?: string
          content_hash?: string | null
          content_length?: number | null
          content_type?: string | null
          created_at?: string
          etag?: string | null
          failure_code?: string | null
          http_status?: number | null
          id?: string
          idempotency_key: string
          last_modified?: string | null
          normalized_content_hash?: string | null
          operation_actor_class: string
          parser_version?: string | null
          raw_content_retention_policy?: string
          retrieval_method: Database["public"]["Enums"]["knowledge_retrieval_method"]
          retrieval_result: Database["public"]["Enums"]["knowledge_acquisition_result"]
          retryable?: boolean
          source_id: string
        }
        Update: {
          actor_audit_identifier?: string
          attempted_at?: string
          content_hash?: string | null
          content_length?: number | null
          content_type?: string | null
          created_at?: string
          etag?: string | null
          failure_code?: string | null
          http_status?: number | null
          id?: string
          idempotency_key?: string
          last_modified?: string | null
          normalized_content_hash?: string | null
          operation_actor_class?: string
          parser_version?: string | null
          raw_content_retention_policy?: string
          retrieval_method?: Database["public"]["Enums"]["knowledge_retrieval_method"]
          retrieval_result?: Database["public"]["Enums"]["knowledge_acquisition_result"]
          retryable?: boolean
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "acquisition_attempt_source_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_source_authorization_transitions: {
        Row: {
          actor_audit_identifier: string
          created_at: string
          from_state:
            | Database["public"]["Enums"]["knowledge_source_authorization_state"]
            | null
          id: string
          idempotency_key: string
          operation: string
          operation_actor_class: string
          previous_state_version: number
          reason: string
          resulting_state_version: number
          source_id: string
          to_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
        }
        Insert: {
          actor_audit_identifier: string
          created_at?: string
          from_state?:
            | Database["public"]["Enums"]["knowledge_source_authorization_state"]
            | null
          id?: string
          idempotency_key: string
          operation: string
          operation_actor_class: string
          previous_state_version: number
          reason: string
          resulting_state_version: number
          source_id: string
          to_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
        }
        Update: {
          actor_audit_identifier?: string
          created_at?: string
          from_state?:
            | Database["public"]["Enums"]["knowledge_source_authorization_state"]
            | null
          id?: string
          idempotency_key?: string
          operation?: string
          operation_actor_class?: string
          previous_state_version?: number
          reason?: string
          resulting_state_version?: number
          source_id?: string
          to_state?: Database["public"]["Enums"]["knowledge_source_authorization_state"]
        }
        Relationships: [
          {
            foreignKeyName: "authorization_transition_source_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_source_handling_policies: {
        Row: {
          created_at: string
          freshness_class: Database["public"]["Enums"]["knowledge_freshness_class"]
          handling_mode: Database["public"]["Enums"]["knowledge_handling_mode"]
          id: string
          information_class: Database["public"]["Enums"]["knowledge_information_class"]
          process_scope: string
          required_context_keys: Database["public"]["Enums"]["knowledge_required_context_key"][]
          revalidation_due_at: string | null
          risk_class: string
          source_id: string
          stale_behavior: Database["public"]["Enums"]["knowledge_stale_behavior"]
          state_version: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          freshness_class: Database["public"]["Enums"]["knowledge_freshness_class"]
          handling_mode: Database["public"]["Enums"]["knowledge_handling_mode"]
          id?: string
          information_class: Database["public"]["Enums"]["knowledge_information_class"]
          process_scope?: string
          required_context_keys?: Database["public"]["Enums"]["knowledge_required_context_key"][]
          revalidation_due_at?: string | null
          risk_class: string
          source_id: string
          stale_behavior: Database["public"]["Enums"]["knowledge_stale_behavior"]
          state_version?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          freshness_class?: Database["public"]["Enums"]["knowledge_freshness_class"]
          handling_mode?: Database["public"]["Enums"]["knowledge_handling_mode"]
          id?: string
          information_class?: Database["public"]["Enums"]["knowledge_information_class"]
          process_scope?: string
          required_context_keys?: Database["public"]["Enums"]["knowledge_required_context_key"][]
          revalidation_due_at?: string | null
          risk_class?: string
          source_id?: string
          stale_behavior?: Database["public"]["Enums"]["knowledge_stale_behavior"]
          state_version?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "handling_policy_source_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_source_passages: {
        Row: {
          article_identifier: string | null
          character_end: number | null
          character_start: number | null
          citation_ready: boolean
          created_at: string
          heading_path: string[] | null
          id: string
          language: string
          page_number: number | null
          paragraph_number: number | null
          passage_order: number
          review_status: string
          section_identifier: string | null
          source_version_id: string
          text: string
          text_hash: string
        }
        Insert: {
          article_identifier?: string | null
          character_end?: number | null
          character_start?: number | null
          citation_ready?: boolean
          created_at?: string
          heading_path?: string[] | null
          id?: string
          language: string
          page_number?: number | null
          paragraph_number?: number | null
          passage_order: number
          review_status?: string
          section_identifier?: string | null
          source_version_id: string
          text: string
          text_hash: string
        }
        Update: {
          article_identifier?: string | null
          character_end?: number | null
          character_start?: number | null
          citation_ready?: boolean
          created_at?: string
          heading_path?: string[] | null
          id?: string
          language?: string
          page_number?: number | null
          paragraph_number?: number | null
          passage_order?: number
          review_status?: string
          section_identifier?: string | null
          source_version_id?: string
          text?: string
          text_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_source_passages_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_source_registry_history: {
        Row: {
          actor_audit_identifier: string
          change_classification: Database["public"]["Enums"]["knowledge_source_change_classification"]
          created_at: string
          id: string
          idempotency_key: string
          new_value: Json | null
          old_value: Json | null
          operation: string
          operation_actor_class: string
          reason: string
          resulting_version: number
          source_id: string
        }
        Insert: {
          actor_audit_identifier: string
          change_classification: Database["public"]["Enums"]["knowledge_source_change_classification"]
          created_at?: string
          id?: string
          idempotency_key: string
          new_value?: Json | null
          old_value?: Json | null
          operation: string
          operation_actor_class: string
          reason: string
          resulting_version: number
          source_id: string
        }
        Update: {
          actor_audit_identifier?: string
          change_classification?: Database["public"]["Enums"]["knowledge_source_change_classification"]
          created_at?: string
          id?: string
          idempotency_key?: string
          new_value?: Json | null
          old_value?: Json | null
          operation?: string
          operation_actor_class?: string
          reason?: string
          resulting_version?: number
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registry_history_source_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_source_versions: {
        Row: {
          acquisition_attempt_id: string | null
          adopted_at: string | null
          applicable_from: string | null
          applicable_until: string | null
          change_classification:
            | Database["public"]["Enums"]["knowledge_source_change_classification"]
            | null
          change_status: string
          content_hash: string
          created_at: string
          current_use_allowed: boolean
          effective_from: string | null
          effective_until: string | null
          freshness_status: string
          historical_use_allowed: boolean
          id: string
          immutable: boolean
          locked_at: string | null
          normalized_content_hash: string | null
          normalized_content_location: string | null
          parser_version: string | null
          promulgated_at: string | null
          published_at: string | null
          raw_content_location: string | null
          retrieved_at: string
          review_status: string
          source_id: string
          source_last_modified_at: string | null
          superseded_by_version_id: string | null
          supersedes_version_id: string | null
          version_sequence: number
        }
        Insert: {
          acquisition_attempt_id?: string | null
          adopted_at?: string | null
          applicable_from?: string | null
          applicable_until?: string | null
          change_classification?:
            | Database["public"]["Enums"]["knowledge_source_change_classification"]
            | null
          change_status?: string
          content_hash: string
          created_at?: string
          current_use_allowed?: boolean
          effective_from?: string | null
          effective_until?: string | null
          freshness_status?: string
          historical_use_allowed?: boolean
          id?: string
          immutable?: boolean
          locked_at?: string | null
          normalized_content_hash?: string | null
          normalized_content_location?: string | null
          parser_version?: string | null
          promulgated_at?: string | null
          published_at?: string | null
          raw_content_location?: string | null
          retrieved_at?: string
          review_status?: string
          source_id: string
          source_last_modified_at?: string | null
          superseded_by_version_id?: string | null
          supersedes_version_id?: string | null
          version_sequence: number
        }
        Update: {
          acquisition_attempt_id?: string | null
          adopted_at?: string | null
          applicable_from?: string | null
          applicable_until?: string | null
          change_classification?:
            | Database["public"]["Enums"]["knowledge_source_change_classification"]
            | null
          change_status?: string
          content_hash?: string
          created_at?: string
          current_use_allowed?: boolean
          effective_from?: string | null
          effective_until?: string | null
          freshness_status?: string
          historical_use_allowed?: boolean
          id?: string
          immutable?: boolean
          locked_at?: string | null
          normalized_content_hash?: string | null
          normalized_content_location?: string | null
          parser_version?: string | null
          promulgated_at?: string | null
          published_at?: string | null
          raw_content_location?: string | null
          retrieved_at?: string
          review_status?: string
          source_id?: string
          source_last_modified_at?: string | null
          superseded_by_version_id?: string | null
          supersedes_version_id?: string | null
          version_sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_source_versions_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_source_versions_superseded_by_version_id_fkey"
            columns: ["superseded_by_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_source_versions_supersedes_version_id_fkey"
            columns: ["supersedes_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_versions_acquisition_attempt_fk"
            columns: ["acquisition_attempt_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_acquisition_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_sources: {
        Row: {
          active_status: Database["public"]["Enums"]["knowledge_source_active_status"]
          archived_at: string | null
          authority_level:
            | Database["public"]["Enums"]["knowledge_authority_level"]
            | null
          authorization_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version: number
          blocked_claim_types: string[]
          canonical_url: string | null
          created_at: string
          default_handling_mode: Database["public"]["Enums"]["knowledge_handling_mode"]
          discovery_use_allowed: boolean
          evidence_eligibility: Database["public"]["Enums"]["knowledge_source_evidence_eligibility"]
          first_verified_at: string | null
          freshness_class: Database["public"]["Enums"]["knowledge_freshness_class"]
          high_risk_use_allowed: boolean
          id: string
          issuing_authority_id: string | null
          jurisdiction_id: string
          last_verified_at: string | null
          normalized_canonical_url: string | null
          normalized_origin: string | null
          official_domain: string | null
          official_domain_verification_status: string
          process_scope: string[]
          publication_identifier: string | null
          publisher_id: string
          registration_idempotency_key: string | null
          retrieval_method:
            | Database["public"]["Enums"]["knowledge_retrieval_method"]
            | null
          revalidation_due_at: string | null
          robots_review_status: Database["public"]["Enums"]["knowledge_access_review_status"]
          source_class:
            | Database["public"]["Enums"]["knowledge_source_class"]
            | null
          source_language: string
          source_purpose: string
          source_type: string
          stale_behavior: Database["public"]["Enums"]["knowledge_stale_behavior"]
          status: string
          supports_claim_types: string[]
          terms_or_license_review_status: Database["public"]["Enums"]["knowledge_access_review_status"]
          territorial_scope_id: string | null
          trust_status: Database["public"]["Enums"]["knowledge_source_trust_status"]
          updated_at: string
        }
        Insert: {
          active_status?: Database["public"]["Enums"]["knowledge_source_active_status"]
          archived_at?: string | null
          authority_level?:
            | Database["public"]["Enums"]["knowledge_authority_level"]
            | null
          authorization_state?: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version?: number
          blocked_claim_types?: string[]
          canonical_url?: string | null
          created_at?: string
          default_handling_mode?: Database["public"]["Enums"]["knowledge_handling_mode"]
          discovery_use_allowed?: boolean
          evidence_eligibility?: Database["public"]["Enums"]["knowledge_source_evidence_eligibility"]
          first_verified_at?: string | null
          freshness_class?: Database["public"]["Enums"]["knowledge_freshness_class"]
          high_risk_use_allowed?: boolean
          id?: string
          issuing_authority_id?: string | null
          jurisdiction_id: string
          last_verified_at?: string | null
          normalized_canonical_url?: string | null
          normalized_origin?: string | null
          official_domain?: string | null
          official_domain_verification_status?: string
          process_scope?: string[]
          publication_identifier?: string | null
          publisher_id: string
          registration_idempotency_key?: string | null
          retrieval_method?:
            | Database["public"]["Enums"]["knowledge_retrieval_method"]
            | null
          revalidation_due_at?: string | null
          robots_review_status?: Database["public"]["Enums"]["knowledge_access_review_status"]
          source_class?:
            | Database["public"]["Enums"]["knowledge_source_class"]
            | null
          source_language: string
          source_purpose: string
          source_type: string
          stale_behavior?: Database["public"]["Enums"]["knowledge_stale_behavior"]
          status?: string
          supports_claim_types?: string[]
          terms_or_license_review_status?: Database["public"]["Enums"]["knowledge_access_review_status"]
          territorial_scope_id?: string | null
          trust_status?: Database["public"]["Enums"]["knowledge_source_trust_status"]
          updated_at?: string
        }
        Update: {
          active_status?: Database["public"]["Enums"]["knowledge_source_active_status"]
          archived_at?: string | null
          authority_level?:
            | Database["public"]["Enums"]["knowledge_authority_level"]
            | null
          authorization_state?: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version?: number
          blocked_claim_types?: string[]
          canonical_url?: string | null
          created_at?: string
          default_handling_mode?: Database["public"]["Enums"]["knowledge_handling_mode"]
          discovery_use_allowed?: boolean
          evidence_eligibility?: Database["public"]["Enums"]["knowledge_source_evidence_eligibility"]
          first_verified_at?: string | null
          freshness_class?: Database["public"]["Enums"]["knowledge_freshness_class"]
          high_risk_use_allowed?: boolean
          id?: string
          issuing_authority_id?: string | null
          jurisdiction_id?: string
          last_verified_at?: string | null
          normalized_canonical_url?: string | null
          normalized_origin?: string | null
          official_domain?: string | null
          official_domain_verification_status?: string
          process_scope?: string[]
          publication_identifier?: string | null
          publisher_id?: string
          registration_idempotency_key?: string | null
          retrieval_method?:
            | Database["public"]["Enums"]["knowledge_retrieval_method"]
            | null
          revalidation_due_at?: string | null
          robots_review_status?: Database["public"]["Enums"]["knowledge_access_review_status"]
          source_class?:
            | Database["public"]["Enums"]["knowledge_source_class"]
            | null
          source_language?: string
          source_purpose?: string
          source_type?: string
          stale_behavior?: Database["public"]["Enums"]["knowledge_stale_behavior"]
          status?: string
          supports_claim_types?: string[]
          terms_or_license_review_status?: Database["public"]["Enums"]["knowledge_access_review_status"]
          territorial_scope_id?: string | null
          trust_status?: Database["public"]["Enums"]["knowledge_source_trust_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_sources_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_sources_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "knowledge_publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_sources_territorial_scope_id_fkey"
            columns: ["territorial_scope_id"]
            isOneToOne: false
            referencedRelation: "knowledge_territorial_scopes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sources_authority_fk"
            columns: ["issuing_authority_id"]
            isOneToOne: false
            referencedRelation: "knowledge_authorities"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_step_dependencies: {
        Row: {
          dependency_group: string | null
          depends_on_step_id: string
          step_id: string
        }
        Insert: {
          dependency_group?: string | null
          depends_on_step_id: string
          step_id: string
        }
        Update: {
          dependency_group?: string | null
          depends_on_step_id?: string
          step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_step_dependencies_depends_on_step_id_fkey"
            columns: ["depends_on_step_id"]
            isOneToOne: false
            referencedRelation: "knowledge_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_step_dependencies_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "knowledge_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_steps: {
        Row: {
          action_id: string | null
          created_at: string
          description_key: string | null
          eligibility_criteria: Json | null
          id: string
          is_active: boolean
          is_critical: boolean
          profile_flag_key: string | null
          slug: string
          sort_order: number
          title_key: string
          topic_id: string
        }
        Insert: {
          action_id?: string | null
          created_at?: string
          description_key?: string | null
          eligibility_criteria?: Json | null
          id: string
          is_active?: boolean
          is_critical?: boolean
          profile_flag_key?: string | null
          slug: string
          sort_order?: number
          title_key: string
          topic_id: string
        }
        Update: {
          action_id?: string | null
          created_at?: string
          description_key?: string | null
          eligibility_criteria?: Json | null
          id?: string
          is_active?: boolean
          is_critical?: boolean
          profile_flag_key?: string | null
          slug?: string
          sort_order?: number
          title_key?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_steps_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "knowledge_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_terminology: {
        Row: {
          canonical_german_term: string
          created_at: string
          definition_canonical: string
          effective_from: string | null
          effective_until: string | null
          id: string
          jurisdiction_id: string | null
          passage_id: string
          process_group_ids: string[] | null
          review_status: string
          risk_level: string
          source_version_id: string
        }
        Insert: {
          canonical_german_term: string
          created_at?: string
          definition_canonical: string
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          jurisdiction_id?: string | null
          passage_id: string
          process_group_ids?: string[] | null
          review_status?: string
          risk_level: string
          source_version_id: string
        }
        Update: {
          canonical_german_term?: string
          created_at?: string
          definition_canonical?: string
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          jurisdiction_id?: string | null
          passage_id?: string
          process_group_ids?: string[] | null
          review_status?: string
          risk_level?: string
          source_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_terminology_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "knowledge_jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_terminology_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_terminology_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_source_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_territorial_scopes: {
        Row: {
          authority_ids: string[]
          bezirk_codes: string[] | null
          city_codes: string[] | null
          created_at: string
          cross_border_countries: string[] | null
          id: string
          jurisdiction_ids: string[]
          kreis_codes: string[] | null
          land_codes: string[] | null
          municipality_codes: string[] | null
          postal_code_areas: string[] | null
          review_status: string
          scope_type: string
          scope_verified: boolean
          service_area_ids: string[] | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          authority_ids?: string[]
          bezirk_codes?: string[] | null
          city_codes?: string[] | null
          created_at?: string
          cross_border_countries?: string[] | null
          id?: string
          jurisdiction_ids?: string[]
          kreis_codes?: string[] | null
          land_codes?: string[] | null
          municipality_codes?: string[] | null
          postal_code_areas?: string[] | null
          review_status?: string
          scope_type: string
          scope_verified?: boolean
          service_area_ids?: string[] | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          authority_ids?: string[]
          bezirk_codes?: string[] | null
          city_codes?: string[] | null
          created_at?: string
          cross_border_countries?: string[] | null
          id?: string
          jurisdiction_ids?: string[]
          kreis_codes?: string[] | null
          land_codes?: string[] | null
          municipality_codes?: string[] | null
          postal_code_areas?: string[] | null
          review_status?: string
          scope_type?: string
          scope_verified?: boolean
          service_area_ids?: string[] | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      knowledge_topics: {
        Row: {
          category: string
          created_at: string
          description_key: string | null
          id: string
          is_active: boolean
          slug: string
          sort_order: number
          title_key: string
        }
        Insert: {
          category: string
          created_at?: string
          description_key?: string | null
          id: string
          is_active?: boolean
          slug: string
          sort_order?: number
          title_key: string
        }
        Update: {
          category?: string
          created_at?: string
          description_key?: string | null
          id?: string
          is_active?: boolean
          slug?: string
          sort_order?: number
          title_key?: string
        }
        Relationships: []
      }
      knowledge_trust_domain_links: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          required: boolean
          trust_domain_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          required?: boolean
          trust_domain_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          required?: boolean
          trust_domain_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_trust_domain_links_trust_domain_id_fkey"
            columns: ["trust_domain_id"]
            isOneToOne: false
            referencedRelation: "knowledge_trust_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_trust_domains: {
        Row: {
          active_from: string | null
          active_until: string | null
          code: string
          created_at: string
          id: string
          name: string
          review_status: string
        }
        Insert: {
          active_from?: string | null
          active_until?: string | null
          code: string
          created_at?: string
          id?: string
          name: string
          review_status?: string
        }
        Update: {
          active_from?: string | null
          active_until?: string | null
          code?: string
          created_at?: string
          id?: string
          name?: string
          review_status?: string
        }
        Relationships: []
      }
      phrase_translations: {
        Row: {
          locale: string
          phrase_id: string
          text: string
        }
        Insert: {
          locale: string
          phrase_id: string
          text: string
        }
        Update: {
          locale?: string
          phrase_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "phrase_translations_phrase_id_fkey"
            columns: ["phrase_id"]
            isOneToOne: false
            referencedRelation: "phrases"
            referencedColumns: ["id"]
          },
        ]
      }
      phrases: {
        Row: {
          category: string
          created_at: string | null
          de_text: string
          id: string
          level: string
          sector: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          de_text: string
          id?: string
          level: string
          sector?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          de_text?: string
          id?: string
          level?: string
          sector?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bundesland: string | null
          children_school_age: boolean | null
          city: string | null
          country: string | null
          created_at: string
          dna: Exclude<Json, null>
          dna_updated_at: string | null
          employment_type: string | null
          family_status: string | null
          goals: string[] | null
          has_address_registration: boolean | null
          has_bank_account: boolean | null
          has_children: boolean | null
          has_cv: boolean | null
          has_health_insurance: boolean | null
          has_steuer_id: boolean | null
          id: string
          job_search_urgency: string | null
          language_level: string | null
          postal_code: string | null
          region: string | null
          registered_arbeitsagentur: boolean | null
          registration_status: string | null
          updated_at: string
        }
        Insert: {
          bundesland?: string | null
          children_school_age?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string
          dna?: Exclude<Json, null>
          dna_updated_at?: string | null
          employment_type?: string | null
          family_status?: string | null
          goals?: string[] | null
          has_address_registration?: boolean | null
          has_bank_account?: boolean | null
          has_children?: boolean | null
          has_cv?: boolean | null
          has_health_insurance?: boolean | null
          has_steuer_id?: boolean | null
          id: string
          job_search_urgency?: string | null
          language_level?: string | null
          postal_code?: string | null
          region?: string | null
          registered_arbeitsagentur?: boolean | null
          registration_status?: string | null
          updated_at?: string
        }
        Update: {
          bundesland?: string | null
          children_school_age?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string
          dna?: Exclude<Json, null>
          dna_updated_at?: string | null
          employment_type?: string | null
          family_status?: string | null
          goals?: string[] | null
          has_address_registration?: boolean | null
          has_bank_account?: boolean | null
          has_children?: boolean | null
          has_cv?: boolean | null
          has_health_insurance?: boolean | null
          has_steuer_id?: boolean | null
          id?: string
          job_search_urgency?: string | null
          language_level?: string | null
          postal_code?: string | null
          region?: string | null
          registered_arbeitsagentur?: boolean | null
          registration_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_action_events: {
        Row: {
          action_id: string
          created_at: string
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          action_id: string
          created_at?: string
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          action_id?: string
          created_at?: string
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_action_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_document_step_verifications: {
        Row: {
          created_at: string
          document_id: string
          id: string
          status: string
          step_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id: string
          id?: string
          status: string
          step_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string
          id?: string
          status?: string
          step_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_document_step_verifications_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "user_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_document_step_verifications_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "knowledge_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_document_step_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_documents: {
        Row: {
          classification_confidence: number | null
          classification_method: string | null
          classification_notes: Json | null
          classification_status: string
          created_at: string
          document_type_id: string | null
          extracted_metadata: Json | null
          extracted_text: string | null
          file_name: string | null
          file_path: string
          id: string
          mime_type: string | null
          user_id: string
        }
        Insert: {
          classification_confidence?: number | null
          classification_method?: string | null
          classification_notes?: Json | null
          classification_status?: string
          created_at?: string
          document_type_id?: string | null
          extracted_metadata?: Json | null
          extracted_text?: string | null
          file_name?: string | null
          file_path: string
          id?: string
          mime_type?: string | null
          user_id: string
        }
        Update: {
          classification_confidence?: number | null
          classification_method?: string | null
          classification_notes?: Json | null
          classification_status?: string
          created_at?: string
          document_type_id?: string | null
          extracted_metadata?: Json | null
          extracted_text?: string | null
          file_name?: string | null
          file_path?: string
          id?: string
          mime_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "document_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_phrase_state: {
        Row: {
          created_at: string
          due_at: string
          ease_factor: number
          id: string
          interval_days: number
          is_favorite: boolean
          phrase_id: string
          repetitions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          is_favorite?: boolean
          phrase_id: string
          repetitions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          due_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          is_favorite?: boolean
          phrase_id?: string
          repetitions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_phrase_state_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          action_id: string
          completed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          action_id: string
          completed_at?: string | null
          status: string
          user_id: string
        }
        Update: {
          action_id?: string
          completed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_step_state: {
        Row: {
          action_id: string | null
          created_at: string
          document_id: string | null
          id: string
          notes: Json | null
          source: string
          status: string
          step_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_id?: string | null
          created_at?: string
          document_id?: string | null
          id?: string
          notes?: Json | null
          source?: string
          status: string
          step_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_id?: string | null
          created_at?: string
          document_id?: string | null
          id?: string
          notes?: Json | null
          source?: string
          status?: string
          step_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_step_state_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "user_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_step_state_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "knowledge_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_step_state_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      /** PostgreSQL identities: armor(bytea) | armor(bytea, text[], text[]) */
      armor: 
        | { Args: [string]; Returns: string }
        | { Args: [string, string[], string[]]; Returns: string }
      /** PostgreSQL identities: claim_next_document_intelligence_job(p_lease_seconds integer) */
      claim_next_document_intelligence_job: {
        Args: { p_lease_seconds?: number }
        Returns: {
          attempt_count: number
          created_at: string
          document_id: string
          finished_at: string | null
          id: string
          last_error: string | null
          last_error_at: string | null
          lease_expires_at: string | null
          lease_token: string | null
          result: Json | null
          scheduled_at: string
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "document_intelligence_jobs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      /** PostgreSQL identities: confirm_document_step_proof(p_document_id uuid, p_step_id text) */
      confirm_document_step_proof: {
        Args: { p_document_id: string; p_step_id: string }
        Returns: Json
      }
      /** PostgreSQL identities: crypt(text, text) */
      crypt: { Args: [string, string]; Returns: string }
      /** PostgreSQL identities: dearmor(text) */
      dearmor: { Args: { "": string }; Returns: string }
      /** PostgreSQL identities: decrypt(bytea, bytea, text) */
      decrypt: { Args: [string, string, string]; Returns: string }
      /** PostgreSQL identities: decrypt_iv(bytea, bytea, bytea, text) */
      decrypt_iv: { Args: [string, string, string, string]; Returns: string }
      /** PostgreSQL identities: digest(bytea, text) | digest(text, text) */
      digest: 
        | { Args: [string, string]; Returns: string }
        | { Args: [string, string]; Returns: string }
      /** PostgreSQL identities: encrypt(bytea, bytea, text) */
      encrypt: { Args: [string, string, string]; Returns: string }
      /** PostgreSQL identities: encrypt_iv(bytea, bytea, bytea, text) */
      encrypt_iv: { Args: [string, string, string, string]; Returns: string }
      /** PostgreSQL identities: enqueue_document_intelligence_job(p_document_id uuid, p_user_id uuid) */
      enqueue_document_intelligence_job: {
        Args: { p_document_id: string; p_user_id: string }
        Returns: {
          attempt_count: number
          created_at: string
          document_id: string
          finished_at: string | null
          id: string
          last_error: string | null
          last_error_at: string | null
          lease_expires_at: string | null
          lease_token: string | null
          result: Json | null
          scheduled_at: string
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "document_intelligence_jobs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      /** PostgreSQL identities: fn_create_translation_candidate_core(p_entity_type text, p_entity_id uuid, p_field_key text, p_output_locale text, p_translated_text text, p_machine_generated boolean, p_machine_provider text, p_machine_model text, p_created_by_actor_class text, p_created_by_audit_identifier text, p_expected_fingerprint text) */
      fn_create_translation_candidate_core: {
        Args: {
          p_created_by_actor_class: string
          p_created_by_audit_identifier: string
          p_entity_id: string
          p_entity_type: string
          p_expected_fingerprint: string
          p_field_key: string
          p_machine_generated: boolean
          p_machine_model: string
          p_machine_provider: string
          p_output_locale: string
          p_translated_text: string
        }
        Returns: {
          canonical_content_fingerprint: string
          translation_id: string
          translation_status: string
          translation_version: number
        }[]
      }
      /** PostgreSQL identities: fn_normalize_and_fingerprint_text(p_text text) */
      fn_normalize_and_fingerprint_text: {
        Args: { p_text: string }
        Returns: string
      }
      /** PostgreSQL identities: fn_publication_subject_exists(p_entity_type text, p_entity_id uuid) */
      fn_publication_subject_exists: {
        Args: { p_entity_id: string; p_entity_type: string }
        Returns: boolean
      }
      /** PostgreSQL identities: fn_translation_target_exists(p_entity_type text, p_entity_id uuid, p_field_key text) */
      fn_translation_target_exists: {
        Args: {
          p_entity_id: string
          p_entity_type: string
          p_field_key: string
        }
        Returns: {
          canonical_content: string
          target_exists: boolean
        }[]
      }
      /** PostgreSQL identities: gen_random_bytes(integer) */
      gen_random_bytes: { Args: [number]; Returns: string }
      /** PostgreSQL identities: gen_random_uuid() */
      gen_random_uuid: { Args: never; Returns: string }
      /** PostgreSQL identities: gen_salt(text) | gen_salt(text, integer) */
      gen_salt: 
        | { Args: [string]; Returns: string }
        | { Args: [string, number]; Returns: string }
      /** PostgreSQL identities: hmac(bytea, bytea, text) | hmac(text, text, text) */
      hmac: 
        | { Args: [string, string, string]; Returns: string }
        | { Args: [string, string, string]; Returns: string }
      /** PostgreSQL identities: i18n_insert_translations_if_missing(p_locale text, p_items jsonb) */
      i18n_insert_translations_if_missing: {
        Args: { p_items: Json; p_locale: string }
        Returns: number
      }
      /** PostgreSQL identities: knowledge_advance_publication_evidence_status(p_entity_type text, p_entity_id uuid, p_to_state text, p_expected_state_version integer, p_reason_text text, p_actor_audit_identifier text, p_idempotency_key text) */
      knowledge_advance_publication_evidence_status: {
        Args: {
          p_actor_audit_identifier: string
          p_entity_id: string
          p_entity_type: string
          p_expected_state_version: number
          p_idempotency_key: string
          p_reason_text: string
          p_to_state: string
        }
        Returns: {
          current_state: string
          state_version: number
          transition_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_advance_publication_lifecycle(p_entity_type text, p_entity_id uuid, p_decision text, p_expected_state_version integer, p_reason_text text, p_actor_audit_identifier text, p_idempotency_key text) */
      knowledge_advance_publication_lifecycle: {
        Args: {
          p_actor_audit_identifier: string
          p_decision: string
          p_entity_id: string
          p_entity_type: string
          p_expected_state_version: number
          p_idempotency_key: string
          p_reason_text: string
        }
        Returns: {
          current_state: string
          state_version: number
          transition_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_approve_translation(p_translation_id uuid, p_reviewer_audit_identifier text, p_review_record_id uuid) */
      knowledge_approve_translation: {
        Args: {
          p_review_record_id: string
          p_reviewer_audit_identifier: string
          p_translation_id: string
        }
        Returns: {
          translation_id: string
          translation_status: string
          verified_at: string
        }[]
      }
      /** PostgreSQL identities: knowledge_assign_source_handling_policy(p_source_id uuid, p_information_class knowledge_information_class, p_process_scope text, p_handling_mode knowledge_handling_mode, p_freshness_class knowledge_freshness_class, p_stale_behavior knowledge_stale_behavior, p_required_context_keys knowledge_required_context_key[], p_risk_class text, p_expected_policy_version integer, p_revalidation_due_at timestamp with time zone, p_actor_audit_identifier text, p_reason text, p_idempotency_key text) */
      knowledge_assign_source_handling_policy: {
        Args: {
          p_actor_audit_identifier: string
          p_expected_policy_version: number
          p_freshness_class: Database["public"]["Enums"]["knowledge_freshness_class"]
          p_handling_mode: Database["public"]["Enums"]["knowledge_handling_mode"]
          p_idempotency_key: string
          p_information_class: Database["public"]["Enums"]["knowledge_information_class"]
          p_process_scope: string
          p_reason: string
          p_required_context_keys: Database["public"]["Enums"]["knowledge_required_context_key"][]
          p_revalidation_due_at: string
          p_risk_class: string
          p_source_id: string
          p_stale_behavior: Database["public"]["Enums"]["knowledge_stale_behavior"]
        }
        Returns: {
          policy_id: string
          policy_state_version: number
        }[]
      }
      /** PostgreSQL identities: knowledge_authorize_official_source(p_source_id uuid, p_expected_version integer, p_review_record_id uuid, p_actor_audit_identifier text, p_reason text, p_idempotency_key text) */
      knowledge_authorize_official_source: {
        Args: {
          p_actor_audit_identifier: string
          p_expected_version: number
          p_idempotency_key: string
          p_reason: string
          p_review_record_id: string
          p_source_id: string
        }
        Returns: {
          authorization_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version: number
          source_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_bootstrap_publication_subject(p_entity_type text, p_entity_id uuid, p_actor_audit_identifier text, p_idempotency_key text) */
      knowledge_bootstrap_publication_subject: {
        Args: {
          p_actor_audit_identifier: string
          p_entity_id: string
          p_entity_type: string
          p_idempotency_key: string
        }
        Returns: {
          current_state: string
          publication_state_id: string
          state_version: number
          transition_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_create_human_translation_candidate(p_entity_type text, p_entity_id uuid, p_field_key text, p_output_locale text, p_translated_text text, p_created_by_audit_identifier text, p_expected_fingerprint text) */
      knowledge_create_human_translation_candidate: {
        Args: {
          p_created_by_audit_identifier: string
          p_entity_id: string
          p_entity_type: string
          p_expected_fingerprint: string
          p_field_key: string
          p_output_locale: string
          p_translated_text: string
        }
        Returns: {
          canonical_content_fingerprint: string
          translation_id: string
          translation_status: string
          translation_version: number
        }[]
      }
      /** PostgreSQL identities: knowledge_create_machine_translation_candidate(p_entity_type text, p_entity_id uuid, p_field_key text, p_output_locale text, p_translated_text text, p_machine_provider text, p_machine_model text, p_created_by_audit_identifier text, p_expected_fingerprint text) */
      knowledge_create_machine_translation_candidate: {
        Args: {
          p_created_by_audit_identifier: string
          p_entity_id: string
          p_entity_type: string
          p_expected_fingerprint: string
          p_field_key: string
          p_machine_model: string
          p_machine_provider: string
          p_output_locale: string
          p_translated_text: string
        }
        Returns: {
          canonical_content_fingerprint: string
          translation_id: string
          translation_status: string
          translation_version: number
        }[]
      }
      /** PostgreSQL identities: knowledge_emergency_suspend_publication_subject(p_entity_type text, p_entity_id uuid, p_expected_state_version integer, p_reason_text text, p_actor_audit_identifier text, p_idempotency_key text) */
      knowledge_emergency_suspend_publication_subject: {
        Args: {
          p_actor_audit_identifier: string
          p_entity_id: string
          p_entity_type: string
          p_expected_state_version: number
          p_idempotency_key: string
          p_reason_text: string
        }
        Returns: {
          current_state: string
          state_version: number
          transition_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_invalidate_translation_for_canonical_change(p_translation_id uuid) */
      knowledge_invalidate_translation_for_canonical_change: {
        Args: { p_translation_id: string }
        Returns: undefined
      }
      /** PostgreSQL identities: knowledge_recall_publication_to_review(p_entity_type text, p_entity_id uuid, p_expected_state_version integer, p_reason_text text, p_actor_audit_identifier text, p_idempotency_key text) */
      knowledge_recall_publication_to_review: {
        Args: {
          p_actor_audit_identifier: string
          p_entity_id: string
          p_entity_type: string
          p_expected_state_version: number
          p_idempotency_key: string
          p_reason_text: string
        }
        Returns: {
          current_state: string
          state_version: number
          transition_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_record_publication_review_decision(p_entity_type text, p_entity_id uuid, p_to_state text, p_expected_state_version integer, p_review_record_id uuid, p_reason_text text, p_actor_audit_identifier text, p_idempotency_key text) */
      knowledge_record_publication_review_decision: {
        Args: {
          p_actor_audit_identifier: string
          p_entity_id: string
          p_entity_type: string
          p_expected_state_version: number
          p_idempotency_key: string
          p_reason_text: string
          p_review_record_id: string
          p_to_state: string
        }
        Returns: {
          current_state: string
          state_version: number
          transition_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_record_source_acquisition_attempt(p_source_id uuid, p_retrieval_method knowledge_retrieval_method, p_retrieval_result knowledge_acquisition_result, p_http_status integer, p_content_type text, p_content_length bigint, p_etag text, p_last_modified timestamp with time zone, p_content_hash text, p_normalized_content_hash text, p_parser_version text, p_failure_code text, p_retryable boolean, p_actor_audit_identifier text, p_idempotency_key text) */
      knowledge_record_source_acquisition_attempt: {
        Args: {
          p_actor_audit_identifier: string
          p_content_hash: string
          p_content_length: number
          p_content_type: string
          p_etag: string
          p_failure_code: string
          p_http_status: number
          p_idempotency_key: string
          p_last_modified: string
          p_normalized_content_hash: string
          p_parser_version: string
          p_retrieval_method: Database["public"]["Enums"]["knowledge_retrieval_method"]
          p_retrieval_result: Database["public"]["Enums"]["knowledge_acquisition_result"]
          p_retryable: boolean
          p_source_id: string
        }
        Returns: {
          acquisition_attempt_id: string
          retrieval_result: Database["public"]["Enums"]["knowledge_acquisition_result"]
        }[]
      }
      /** PostgreSQL identities: knowledge_record_source_authority_verification(p_source_id uuid, p_expected_version integer, p_authority_id uuid, p_authority_level knowledge_authority_level, p_review_record_id uuid, p_actor_audit_identifier text, p_reason text, p_idempotency_key text) */
      knowledge_record_source_authority_verification: {
        Args: {
          p_actor_audit_identifier: string
          p_authority_id: string
          p_authority_level: Database["public"]["Enums"]["knowledge_authority_level"]
          p_expected_version: number
          p_idempotency_key: string
          p_reason: string
          p_review_record_id: string
          p_source_id: string
        }
        Returns: {
          authorization_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version: number
          source_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_record_source_robots_review(p_source_id uuid, p_expected_version integer, p_review_status knowledge_access_review_status, p_review_record_id uuid, p_actor_audit_identifier text, p_reason text, p_idempotency_key text) */
      knowledge_record_source_robots_review: {
        Args: {
          p_actor_audit_identifier: string
          p_expected_version: number
          p_idempotency_key: string
          p_reason: string
          p_review_record_id: string
          p_review_status: Database["public"]["Enums"]["knowledge_access_review_status"]
          p_source_id: string
        }
        Returns: {
          authorization_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version: number
          source_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_record_source_terms_review(p_source_id uuid, p_expected_version integer, p_review_status knowledge_access_review_status, p_review_record_id uuid, p_actor_audit_identifier text, p_reason text, p_idempotency_key text) */
      knowledge_record_source_terms_review: {
        Args: {
          p_actor_audit_identifier: string
          p_expected_version: number
          p_idempotency_key: string
          p_reason: string
          p_review_record_id: string
          p_review_status: Database["public"]["Enums"]["knowledge_access_review_status"]
          p_source_id: string
        }
        Returns: {
          authorization_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version: number
          source_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_register_official_source(p_publisher_id uuid, p_source_type text, p_source_purpose text, p_canonical_url text, p_normalized_canonical_url text, p_normalized_origin text, p_source_class knowledge_source_class, p_jurisdiction_id uuid, p_territorial_scope_id uuid, p_issuing_authority_id uuid, p_authority_level knowledge_authority_level, p_source_language text, p_process_scope text[], p_retrieval_method knowledge_retrieval_method, p_actor_audit_identifier text, p_idempotency_key text) */
      knowledge_register_official_source: {
        Args: {
          p_actor_audit_identifier: string
          p_authority_level: Database["public"]["Enums"]["knowledge_authority_level"]
          p_canonical_url: string
          p_idempotency_key: string
          p_issuing_authority_id: string
          p_jurisdiction_id: string
          p_normalized_canonical_url: string
          p_normalized_origin: string
          p_process_scope: string[]
          p_publisher_id: string
          p_retrieval_method: Database["public"]["Enums"]["knowledge_retrieval_method"]
          p_source_class: Database["public"]["Enums"]["knowledge_source_class"]
          p_source_language: string
          p_source_purpose: string
          p_source_type: string
          p_territorial_scope_id: string
        }
        Returns: {
          authorization_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version: number
          source_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_reject_official_source(p_source_id uuid, p_expected_version integer, p_review_record_id uuid, p_actor_audit_identifier text, p_reason text, p_idempotency_key text) */
      knowledge_reject_official_source: {
        Args: {
          p_actor_audit_identifier: string
          p_expected_version: number
          p_idempotency_key: string
          p_reason: string
          p_review_record_id: string
          p_source_id: string
        }
        Returns: {
          authorization_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version: number
          source_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_reject_translation(p_translation_id uuid, p_reviewer_audit_identifier text, p_rejection_reason text) */
      knowledge_reject_translation: {
        Args: {
          p_rejection_reason: string
          p_reviewer_audit_identifier: string
          p_translation_id: string
        }
        Returns: {
          translation_id: string
          translation_status: string
        }[]
      }
      /** PostgreSQL identities: knowledge_retire_official_source(p_source_id uuid, p_expected_version integer, p_actor_audit_identifier text, p_reason text, p_idempotency_key text) */
      knowledge_retire_official_source: {
        Args: {
          p_actor_audit_identifier: string
          p_expected_version: number
          p_idempotency_key: string
          p_reason: string
          p_source_id: string
        }
        Returns: {
          authorization_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version: number
          source_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_submit_translation_for_review(p_translation_id uuid, p_actor_audit_identifier text) */
      knowledge_submit_translation_for_review: {
        Args: { p_actor_audit_identifier: string; p_translation_id: string }
        Returns: {
          translation_id: string
          translation_status: string
        }[]
      }
      /** PostgreSQL identities: knowledge_supersede_publication_subject(p_entity_type text, p_entity_id uuid, p_expected_state_version integer, p_reason_text text, p_replacement_entity_type text, p_replacement_entity_id uuid, p_actor_audit_identifier text, p_idempotency_key text) */
      knowledge_supersede_publication_subject: {
        Args: {
          p_actor_audit_identifier: string
          p_entity_id: string
          p_entity_type: string
          p_expected_state_version: number
          p_idempotency_key: string
          p_reason_text: string
          p_replacement_entity_id: string
          p_replacement_entity_type: string
        }
        Returns: {
          current_state: string
          state_version: number
          transition_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_suspend_official_source(p_source_id uuid, p_expected_version integer, p_actor_audit_identifier text, p_reason text, p_idempotency_key text) */
      knowledge_suspend_official_source: {
        Args: {
          p_actor_audit_identifier: string
          p_expected_version: number
          p_idempotency_key: string
          p_reason: string
          p_source_id: string
        }
        Returns: {
          authorization_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version: number
          source_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_suspend_publication_for_detected_issue(p_entity_type text, p_entity_id uuid, p_expected_state_version integer, p_reason_code text, p_reason_text text, p_actor_audit_identifier text, p_idempotency_key text) */
      knowledge_suspend_publication_for_detected_issue: {
        Args: {
          p_actor_audit_identifier: string
          p_entity_id: string
          p_entity_type: string
          p_expected_state_version: number
          p_idempotency_key: string
          p_reason_code: string
          p_reason_text: string
        }
        Returns: {
          current_state: string
          state_version: number
          transition_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_transition_publication_state(p_entity_type text, p_entity_id uuid, p_to_state text, p_expected_state_version integer, p_reason_code text, p_reason_text text, p_actor_class text, p_actor_identifier text, p_review_record_id uuid, p_replacement_entity_type text, p_replacement_entity_id uuid, p_emergency boolean, p_idempotency_key text) */
      knowledge_transition_publication_state: {
        Args: {
          p_actor_class: string
          p_actor_identifier: string
          p_emergency: boolean
          p_entity_id: string
          p_entity_type: string
          p_expected_state_version: number
          p_idempotency_key: string
          p_reason_code: string
          p_reason_text: string
          p_replacement_entity_id: string
          p_replacement_entity_type: string
          p_review_record_id: string
          p_to_state: string
        }
        Returns: {
          current_state: string
          state_version: number
          transition_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_transition_source_authorization_internal(p_source_id uuid, p_expected_version integer, p_to_state knowledge_source_authorization_state, p_operation text, p_operation_actor_class text, p_actor_audit_identifier text, p_reason text, p_idempotency_key text) */
      knowledge_transition_source_authorization_internal: {
        Args: {
          p_actor_audit_identifier: string
          p_expected_version: number
          p_idempotency_key: string
          p_operation: string
          p_operation_actor_class: string
          p_reason: string
          p_source_id: string
          p_to_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
        }
        Returns: {
          authorization_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version: number
          source_id: string
          transition_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_update_official_source_metadata(p_source_id uuid, p_expected_version integer, p_canonical_url text, p_normalized_canonical_url text, p_normalized_origin text, p_source_class knowledge_source_class, p_issuing_authority_id uuid, p_authority_level knowledge_authority_level, p_jurisdiction_id uuid, p_territorial_scope_id uuid, p_process_scope text[], p_retrieval_method knowledge_retrieval_method, p_actor_audit_identifier text, p_reason text, p_idempotency_key text) */
      knowledge_update_official_source_metadata: {
        Args: {
          p_actor_audit_identifier: string
          p_authority_level: Database["public"]["Enums"]["knowledge_authority_level"]
          p_canonical_url: string
          p_expected_version: number
          p_idempotency_key: string
          p_issuing_authority_id: string
          p_jurisdiction_id: string
          p_normalized_canonical_url: string
          p_normalized_origin: string
          p_process_scope: string[]
          p_reason: string
          p_retrieval_method: Database["public"]["Enums"]["knowledge_retrieval_method"]
          p_source_class: Database["public"]["Enums"]["knowledge_source_class"]
          p_source_id: string
          p_territorial_scope_id: string
        }
        Returns: {
          authorization_state: Database["public"]["Enums"]["knowledge_source_authorization_state"]
          authorization_state_version: number
          source_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_withdraw_publication_subject(p_entity_type text, p_entity_id uuid, p_expected_state_version integer, p_reason_text text, p_actor_audit_identifier text, p_idempotency_key text) */
      knowledge_withdraw_publication_subject: {
        Args: {
          p_actor_audit_identifier: string
          p_entity_id: string
          p_entity_type: string
          p_expected_state_version: number
          p_idempotency_key: string
          p_reason_text: string
        }
        Returns: {
          current_state: string
          state_version: number
          transition_id: string
        }[]
      }
      /** PostgreSQL identities: knowledge_withdraw_translation(p_translation_id uuid, p_actor_audit_identifier text, p_reason_text text) */
      knowledge_withdraw_translation: {
        Args: {
          p_actor_audit_identifier: string
          p_reason_text: string
          p_translation_id: string
        }
        Returns: {
          translation_id: string
          translation_status: string
        }[]
      }
      /** PostgreSQL identities: pgp_armor_headers(text, OUT key text, OUT value text) */
      pgp_armor_headers: {
        Args: { "": string }
        Returns: Record<string, unknown>[]
      }
      /** PostgreSQL identities: pgp_key_id(bytea) */
      pgp_key_id: { Args: [string]; Returns: string }
      /** PostgreSQL identities: pgp_pub_decrypt(bytea, bytea) | pgp_pub_decrypt(bytea, bytea, text) | pgp_pub_decrypt(bytea, bytea, text, text) */
      pgp_pub_decrypt: 
        | { Args: [string, string]; Returns: string }
        | { Args: [string, string, string]; Returns: string }
        | { Args: [string, string, string, string]; Returns: string }
      /** PostgreSQL identities: pgp_pub_decrypt_bytea(bytea, bytea) | pgp_pub_decrypt_bytea(bytea, bytea, text) | pgp_pub_decrypt_bytea(bytea, bytea, text, text) */
      pgp_pub_decrypt_bytea: 
        | { Args: [string, string]; Returns: string }
        | { Args: [string, string, string]; Returns: string }
        | { Args: [string, string, string, string]; Returns: string }
      /** PostgreSQL identities: pgp_pub_encrypt(text, bytea) | pgp_pub_encrypt(text, bytea, text) */
      pgp_pub_encrypt: 
        | { Args: [string, string]; Returns: string }
        | { Args: [string, string, string]; Returns: string }
      /** PostgreSQL identities: pgp_pub_encrypt_bytea(bytea, bytea) | pgp_pub_encrypt_bytea(bytea, bytea, text) */
      pgp_pub_encrypt_bytea: 
        | { Args: [string, string]; Returns: string }
        | { Args: [string, string, string]; Returns: string }
      /** PostgreSQL identities: pgp_sym_decrypt(bytea, text) | pgp_sym_decrypt(bytea, text, text) */
      pgp_sym_decrypt: 
        | { Args: [string, string]; Returns: string }
        | { Args: [string, string, string]; Returns: string }
      /** PostgreSQL identities: pgp_sym_decrypt_bytea(bytea, text) | pgp_sym_decrypt_bytea(bytea, text, text) */
      pgp_sym_decrypt_bytea: 
        | { Args: [string, string]; Returns: string }
        | { Args: [string, string, string]; Returns: string }
      /** PostgreSQL identities: pgp_sym_encrypt(text, text) | pgp_sym_encrypt(text, text, text) */
      pgp_sym_encrypt: 
        | { Args: [string, string]; Returns: string }
        | { Args: [string, string, string]; Returns: string }
      /** PostgreSQL identities: pgp_sym_encrypt_bytea(bytea, text) | pgp_sym_encrypt_bytea(bytea, text, text) */
      pgp_sym_encrypt_bytea: 
        | { Args: [string, string]; Returns: string }
        | { Args: [string, string, string]; Returns: string }
      /** PostgreSQL identities: reject_document_step_proof(p_document_id uuid, p_step_id text) */
      reject_document_step_proof: {
        Args: { p_document_id: string; p_step_id: string }
        Returns: Json
      }
      /** PostgreSQL identities: uuid_generate_v1() */
      uuid_generate_v1: { Args: never; Returns: string }
      /** PostgreSQL identities: uuid_generate_v1mc() */
      uuid_generate_v1mc: { Args: never; Returns: string }
      /** PostgreSQL identities: uuid_generate_v3(namespace uuid, name text) */
      uuid_generate_v3: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      /** PostgreSQL identities: uuid_generate_v4() */
      uuid_generate_v4: { Args: never; Returns: string }
      /** PostgreSQL identities: uuid_generate_v5(namespace uuid, name text) */
      uuid_generate_v5: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      /** PostgreSQL identities: uuid_nil() */
      uuid_nil: { Args: never; Returns: string }
      /** PostgreSQL identities: uuid_ns_dns() */
      uuid_ns_dns: { Args: never; Returns: string }
      /** PostgreSQL identities: uuid_ns_oid() */
      uuid_ns_oid: { Args: never; Returns: string }
      /** PostgreSQL identities: uuid_ns_url() */
      uuid_ns_url: { Args: never; Returns: string }
      /** PostgreSQL identities: uuid_ns_x500() */
      uuid_ns_x500: { Args: never; Returns: string }
    }
    Enums: {
      knowledge_access_review_status:
        | "NOT_REVIEWED"
        | "ALLOWED"
        | "RESTRICTED"
        | "PROHIBITED"
        | "UNKNOWN"
      knowledge_acquisition_result:
        | "SUCCESS"
        | "NOT_MODIFIED"
        | "FAILED"
        | "DENIED"
      knowledge_authority_level:
        | "EU"
        | "FEDERAL"
        | "LAND"
        | "MUNICIPALITY"
        | "SPECIFIC_AUTHORITY"
        | "UNRESOLVED"
      knowledge_freshness_class:
        | "REAL_TIME"
        | "DAILY"
        | "WEEKLY"
        | "MONTHLY"
        | "EVENT_DRIVEN"
        | "LEGAL_CHANGE_MONITORED"
        | "MANUAL_REVIEW_CYCLE"
      knowledge_handling_mode:
        | "STORE_CANONICALLY"
        | "FETCH_LIVE"
        | "CACHE_AND_REVALIDATE"
        | "MANUAL_REVIEW_REQUIRED"
        | "DO_NOT_ANSWER_WITHOUT_CONTEXT"
      knowledge_information_class:
        | "LEGAL_BASELINE"
        | "PROCESS_IDENTITY"
        | "AUTHORITY_COMPETENCE"
        | "ELIGIBILITY"
        | "REQUIRED_EVIDENCE"
        | "DEADLINE"
        | "FEE"
        | "SANCTION"
        | "FORM_URL"
        | "ONLINE_SERVICE_URL"
        | "OPENING_HOURS"
        | "APPOINTMENT_AVAILABILITY"
        | "CONTACT_DETAILS"
        | "LOCAL_PROCESS_VARIANT"
      knowledge_required_context_key:
        | "COUNTRY"
        | "BUNDESLAND"
        | "MUNICIPALITY"
        | "PROCESS_VARIANT"
        | "EVENT_DATE"
        | "RESIDENCE_STATE"
        | "WORK_STATE"
        | "PROFESSION"
        | "BUSINESS_ESTABLISHMENT_STATE"
        | "MAIN_OR_SECONDARY_RESIDENCE"
      knowledge_retrieval_method:
        | "HTML_DOCUMENT"
        | "PDF_DOCUMENT"
        | "API_JSON"
        | "MANUAL_BROWSER_INSPECTION"
      knowledge_source_active_status:
        | "INACTIVE"
        | "ACTIVE"
        | "SUSPENDED"
        | "RETIRED"
      knowledge_source_authorization_state:
        | "DRAFT"
        | "PENDING_TERMS_REVIEW"
        | "PENDING_AUTHORITY_VERIFICATION"
        | "AUTHORIZED"
        | "SUSPENDED"
        | "REJECTED"
        | "RETIRED"
      knowledge_source_change_classification:
        | "UNCHANGED"
        | "CONTENT_CHANGE"
        | "LEGAL_OR_POLICY_CHANGE"
        | "URL_CHANGE"
        | "SOURCE_CLASS_CHANGE"
        | "EVIDENCE_ELIGIBILITY_CHANGE"
        | "AUTHORITY_ASSIGNMENT_CHANGE"
        | "JURISDICTION_CHANGE"
        | "TERMS_REVIEW_CHANGE"
        | "ROBOTS_REVIEW_CHANGE"
        | "HANDLING_POLICY_CHANGE"
        | "TRUST_STATUS_CHANGE"
        | "ACTIVE_STATUS_CHANGE"
        | "METADATA_CHANGE"
      knowledge_source_class:
        | "FEDERAL_LAW"
        | "FEDERAL_REGULATION"
        | "FEDERAL_ADMINISTRATIVE_GUIDANCE"
        | "EU_LAW"
        | "EU_OFFICIAL_GUIDANCE"
        | "FEDERAL_SERVICE_PORTAL"
        | "LAND_SERVICE_PORTAL"
        | "MUNICIPALITY_SERVICE_PORTAL"
        | "AUTHORITY_PORTAL"
        | "OFFICIAL_FORM"
        | "OFFICIAL_ONLINE_SERVICE"
        | "OFFICIAL_DATASET"
        | "COMMERCIAL_GUIDE"
        | "BLOG"
        | "FORUM"
        | "SEARCH_RESULT_SNIPPET"
        | "AI_GENERATED_TEXT"
      knowledge_source_evidence_eligibility:
        | "PUBLICATION_EVIDENCE_ELIGIBLE"
        | "DISCOVERY_ONLY"
      knowledge_source_trust_status:
        | "UNVERIFIED"
        | "VERIFIED"
        | "REVIEW_REQUIRED"
        | "SUSPENDED"
      knowledge_stale_behavior:
        | "ALLOW_WITH_STALE_WARNING"
        | "REVALIDATE_BEFORE_USE"
        | "DO_NOT_USE_STALE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      knowledge_access_review_status: [
        "NOT_REVIEWED",
        "ALLOWED",
        "RESTRICTED",
        "PROHIBITED",
        "UNKNOWN",
      ],
      knowledge_acquisition_result: [
        "SUCCESS",
        "NOT_MODIFIED",
        "FAILED",
        "DENIED",
      ],
      knowledge_authority_level: [
        "EU",
        "FEDERAL",
        "LAND",
        "MUNICIPALITY",
        "SPECIFIC_AUTHORITY",
        "UNRESOLVED",
      ],
      knowledge_freshness_class: [
        "REAL_TIME",
        "DAILY",
        "WEEKLY",
        "MONTHLY",
        "EVENT_DRIVEN",
        "LEGAL_CHANGE_MONITORED",
        "MANUAL_REVIEW_CYCLE",
      ],
      knowledge_handling_mode: [
        "STORE_CANONICALLY",
        "FETCH_LIVE",
        "CACHE_AND_REVALIDATE",
        "MANUAL_REVIEW_REQUIRED",
        "DO_NOT_ANSWER_WITHOUT_CONTEXT",
      ],
      knowledge_information_class: [
        "LEGAL_BASELINE",
        "PROCESS_IDENTITY",
        "AUTHORITY_COMPETENCE",
        "ELIGIBILITY",
        "REQUIRED_EVIDENCE",
        "DEADLINE",
        "FEE",
        "SANCTION",
        "FORM_URL",
        "ONLINE_SERVICE_URL",
        "OPENING_HOURS",
        "APPOINTMENT_AVAILABILITY",
        "CONTACT_DETAILS",
        "LOCAL_PROCESS_VARIANT",
      ],
      knowledge_required_context_key: [
        "COUNTRY",
        "BUNDESLAND",
        "MUNICIPALITY",
        "PROCESS_VARIANT",
        "EVENT_DATE",
        "RESIDENCE_STATE",
        "WORK_STATE",
        "PROFESSION",
        "BUSINESS_ESTABLISHMENT_STATE",
        "MAIN_OR_SECONDARY_RESIDENCE",
      ],
      knowledge_retrieval_method: [
        "HTML_DOCUMENT",
        "PDF_DOCUMENT",
        "API_JSON",
        "MANUAL_BROWSER_INSPECTION",
      ],
      knowledge_source_active_status: [
        "INACTIVE",
        "ACTIVE",
        "SUSPENDED",
        "RETIRED",
      ],
      knowledge_source_authorization_state: [
        "DRAFT",
        "PENDING_TERMS_REVIEW",
        "PENDING_AUTHORITY_VERIFICATION",
        "AUTHORIZED",
        "SUSPENDED",
        "REJECTED",
        "RETIRED",
      ],
      knowledge_source_change_classification: [
        "UNCHANGED",
        "CONTENT_CHANGE",
        "LEGAL_OR_POLICY_CHANGE",
        "URL_CHANGE",
        "SOURCE_CLASS_CHANGE",
        "EVIDENCE_ELIGIBILITY_CHANGE",
        "AUTHORITY_ASSIGNMENT_CHANGE",
        "JURISDICTION_CHANGE",
        "TERMS_REVIEW_CHANGE",
        "ROBOTS_REVIEW_CHANGE",
        "HANDLING_POLICY_CHANGE",
        "TRUST_STATUS_CHANGE",
        "ACTIVE_STATUS_CHANGE",
        "METADATA_CHANGE",
      ],
      knowledge_source_class: [
        "FEDERAL_LAW",
        "FEDERAL_REGULATION",
        "FEDERAL_ADMINISTRATIVE_GUIDANCE",
        "EU_LAW",
        "EU_OFFICIAL_GUIDANCE",
        "FEDERAL_SERVICE_PORTAL",
        "LAND_SERVICE_PORTAL",
        "MUNICIPALITY_SERVICE_PORTAL",
        "AUTHORITY_PORTAL",
        "OFFICIAL_FORM",
        "OFFICIAL_ONLINE_SERVICE",
        "OFFICIAL_DATASET",
        "COMMERCIAL_GUIDE",
        "BLOG",
        "FORUM",
        "SEARCH_RESULT_SNIPPET",
        "AI_GENERATED_TEXT",
      ],
      knowledge_source_evidence_eligibility: [
        "PUBLICATION_EVIDENCE_ELIGIBLE",
        "DISCOVERY_ONLY",
      ],
      knowledge_source_trust_status: [
        "UNVERIFIED",
        "VERIFIED",
        "REVIEW_REQUIRED",
        "SUSPENDED",
      ],
      knowledge_stale_behavior: [
        "ALLOW_WITH_STALE_WARNING",
        "REVALIDATE_BEFORE_USE",
        "DO_NOT_USE_STALE",
      ],
    },
  },
} as const
