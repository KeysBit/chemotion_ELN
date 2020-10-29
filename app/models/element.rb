# == Schema Information
#
# Table name: elements
#
#  id               :integer          not null, primary key
#  name             :string
#  element_klass_id :integer
#  properties       :jsonb
#  created_by       :integer
#  created_at       :datetime
#  updated_at       :datetime
#  deleted_at       :datetime
#  short_label      :string
#

# Generic Element
class Element < ActiveRecord::Base
  acts_as_paranoid
  include ElementUIStateScopes
  include Collectable
  include AnalysisCodes
  include Taggable

  scope :by_name, ->(query) { where('name ILIKE ?', "%#{sanitize_sql_like(query)}%") }

  belongs_to :element_klass
  has_many :collections_elements, dependent: :destroy
  has_many :collections, through: :collections_elements

  has_one :container, :as => :containable

  accepts_nested_attributes_for :collections_elements

  belongs_to :creator, foreign_key: :created_by, class_name: 'User'
  validates :creator, presence: true

  before_create :auto_set_short_label
  after_create :update_counter

  def analyses
    container ? container.analyses : []
  end

  def auto_set_short_label
    prefix = element_klass.klass_prefix
    if creator.counters[element_klass.name].nil?
      creator.counters[element_klass.name] = '0'
      creator.update_columns(counters: creator.counters)
      creator.reload
    end
    counter = creator.counters[element_klass.name].to_i.succ
    self.short_label = "#{creator.initials}-#{prefix}#{counter}"
  end

  def update_counter
    creator.increment_counter element_klass.name
  end
end
