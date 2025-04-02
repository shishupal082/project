class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    if value.length < 30
      record.errors[attribute] << (options[:message] || "invalidMinlength")
    end
    unless value =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
      record.errors[attribute] << (options[:message] || "invalidRegexEmail")
    end
  end
end

class NameValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless value =~ /^([a-zA-Z])([a-zA-Z0-9@\s:.+-,!|])*$/i
      record.errors[attribute] << (options[:message] || "invalidRegexName")
    end
  end
end

class User < ActiveRecord::Base
	# include ActiveModel::Validations
	validates_presence_of :email, :message => "required"
	validates :email, email: true
	validates :mobile, :numericality => { :message => " should be a number" }
	validates :mobile, :inclusion => { :in => 0..9, :message => " should be between 1 to 10" }
	validates :name, name: true
	validates :name, :length => { in: 3..63, :message => "invalidLengthName" }

	# validates :email, presence: true, uniqueness: true#, email: true #, message: "emailRequired"
	# validates :mobile, presence: true, uniqueness: true, :message => "phone is not valid"
end


